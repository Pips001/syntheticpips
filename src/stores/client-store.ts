// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import { action, computed, makeObservable, observable } from 'mobx';
/* [AI] - Analytics removed - utility functions moved to @/utils/account-helpers */
import { getAccountId } from '@/utils/account-helpers';
/* [/AI] */
import { isEmptyObject } from '@/components/shared';
import { isMultipliersOnly, isOptionsBlocked } from '@/components/shared/common/utility';
import { removeCookies } from '@/components/shared/utils/storage/storage';
import { observer as globalObserver, observer } from '@/external/bot-skeleton';
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import { ErrorLogger } from '@/utils/error-logger';
import type { Balance } from '@deriv/api-types';
import {
    authData$,
    setAccountList,
    setAuthData,
    setIsAuthorized,
} from '../external/bot-skeleton/services/api/observables/connection-status-stream';
import type { TAuthData } from '../types/api-types';
import type RootStore from './root-store';

export default class ClientStore {
    loginid = '';
    account_list: TAuthData['account_list'] = [];
    balance = '0';
    currency = 'AUD';
    is_logged_in = false;
    is_account_regenerating = false;

    accounts: Record<string, TAuthData['account_list'][number]> = {};
    all_accounts_balance: Balance | null = null;
    is_logging_out = false;

    private authDataSubscription: { unsubscribe: () => void } | null = null;
    private root_store: RootStore;
    private tab_visibility_handler: ((event: Event) => void) | null = null;
    private ws_login_id: string | null = null;
    private is_regenerating = false;
    private instance_id: string = '';

    // TODO: fix with self exclusion

    onAuthorizeEvent = (data: {
        account_list?: TAuthData['account_list'];
        current_account?: { loginid: string; currency: string; is_virtual: number; balance?: number };
    }) => {
        if (data?.account_list) {
            this.setAccountList(data.account_list);
        }

        // Update current account details from new API structure
        if (data?.current_account) {
            this.setLoginId(data.current_account.loginid);
            this.setCurrency(data.current_account.currency);
            this.setIsLoggedIn(true);
            localStorage.setItem('active_loginid', data.current_account.loginid);

            // Store the login ID used for WebSocket connection
            this.setWebSocketLoginId(data.current_account.loginid);

            if (typeof data.current_account.balance === 'number') {
                this.setBalance(data.current_account.balance.toString());
            }
        }
    };

    // Listen to live balance updates pushed by Deriv WebSocket upon trade execution/settlement
    onBalanceEvent = (response: { balance?: { balance: number; currency: string; loginid: string } }) => {
        if (response?.balance) {
            const { balance, loginid } = response.balance;
            if (loginid === this.loginid && typeof balance === 'number') {
                this.setBalance(balance.toString());
            }
        }
    };

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        // Subscribe to auth data changes
        this.authDataSubscription = authData$.subscribe(() => {});

        observer.register('api.authorize', this.onAuthorizeEvent);
        observer.register('api.balance', this.onBalanceEvent);

        // Clean up any existing instance before registering new one to prevent memory leaks
        const existingId = globalObserver.getState('client.store.id');
        if (existingId) {
            globalObserver.setState({ 'client.store': null, 'client.store.id': null });
        }

        // Register this instance with the global observer so api-base can access it
        // Store a reference to this instance with a cryptographically secure unique ID to prevent memory leaks
        // Use crypto.getRandomValues for better uniqueness and security than Math.random()
        this.instance_id = `client_store_${Date.now()}_${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
        globalObserver.setState({ 'client.store': this, 'client.store.id': this.instance_id });

        // Set up visibility change listener to regenerate WebSocket when tab becomes visible
        this.setupVisibilityListener();

        makeObservable(this, {
            accounts: observable,
            account_list: observable,

            all_accounts_balance: observable,
            balance: observable,
            currency: observable,

            is_logged_in: observable,
            is_account_regenerating: observable,
            loginid: observable,
            is_logging_out: observable,
            active_accounts: computed,
            is_bot_allowed: computed,

            is_eu_or_multipliers_only: computed,
            is_low_risk: computed,
            is_multipliers_only: computed,
            is_options_blocked: computed,
            is_virtual: computed,

            residence: computed,

            logout: action,
            onAuthorizeEvent: action,
            onBalanceEvent: action,
            setAccountList: action,

            setAllAccountsBalance: action,
            setIsAccountRegenerating: action,
            setBalance: action,
            setCurrency: action,
            setIsLoggedIn: action,
            setIsLoggingOut: action,
            setLoginId: action,

            is_trading_experience_incomplete: computed,
            is_cr_account: computed,
            account_open_date: computed,
        });
    }

    get active_accounts() {
        return this.accounts instanceof Object
            ? Object.values(this.accounts).filter(account => !account.is_disabled)
            : [];
    }

    get is_bot_allowed() {
        return this.isBotAllowed();
    }
    get is_trading_experience_incomplete() {
        return false;
    }

    get is_low_risk() {
        return false;
    }

    get residence() {
        return '';
    }

    get is_options_blocked() {
        return isOptionsBlocked(this.residence);
    }

    get is_multipliers_only() {
        return isMultipliersOnly(this.residence);
    }

    get is_eu_or_multipliers_only() {
        // Always return false - EU restrictions now handled by backend
        return false;
    }

    get is_virtual() {
        return !isEmptyObject(this.accounts) && this.accounts[this.loginid] && !!this.accounts[this.loginid].is_virtual;
    }

    get all_loginids() {
        return !isEmptyObject(this.accounts) ? Object.keys(this.accounts) : [];
    }

    get virtual_account_loginid() {
        return this.all_loginids.find(loginid => !!this.accounts[loginid].is_virtual);
    }

    get is_cr_account() {
        return this.loginid?.startsWith('CR');
    }

    get should_hide_header() {
        return false;
    }

    get account_open_date() {
        if (isEmptyObject(this.accounts) || !this.accounts[this.loginid]) return undefined;
        return Object.keys(this.accounts[this.loginid]).includes('created_at')
            ? this.accounts[this.loginid].created_at
            : undefined;
    }

    isBotAllowed = () => {
        return this.is_virtual ? this.is_eu_or_multipliers_only : !this.is_options_blocked;
    };

    setLoginId = (loginid: string) => {
        this.loginid = loginid;
    };

    setAccountList = (account_list?: TAuthData['account_list']) => {
        this.accounts = {};
        account_list?.forEach(account => {
            this.accounts[account.loginid] = account;
        });
        if (account_list) this.account_list = account_list;
    };

    setBalance = (balance: string) => {
        this.balance = balance;
    };

    setCurrency = (currency: string) => {
        this.currency = currency;
    };

    setIsLoggedIn = (is_logged_in: boolean) => {
        this.is_logged_in = is_logged_in;
    };

    getCurrency = () => {
        const clientAccounts = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
        return clientAccounts[this.loginid]?.currency ?? '';
    };

    getToken = () => {
        const accountList = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
        return accountList[this.loginid] ?? '';
    };

    setAllAccountsBalance = (all_accounts_balance: Balance | undefined) => {
        this.all_accounts_balance = all_accounts_balance ?? null;
    };
    setIsAccountRegenerating = (is_loading: boolean) => {
        this.is_account_regenerating = is_loading;
    };

    setIsLoggingOut = (is_logging_out: boolean) => {
        this.is_logging_out = is_logging_out;
    };

    /**
     * Request logout via WebSocket (legacy method for backward compatibility)
     * @returns Promise with logout response
     */

    logout = async () => {
        
