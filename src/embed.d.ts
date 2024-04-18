declare module '@knowlearning/agents' {
	export interface BrowserAgentAuthInfo {
		name?: string;
	}
	export interface BrowserAgentAuth {
		provider: string;
		info?: BrowserAgentAuthInfo;
	}

	export interface BrowserAgentEnvironment {
		auth: BrowserAgentAuth;
		domain: string;
		server: string;
		session: string;
	}

	export interface BrowserAgentInterface {
		close(): void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		state(ns?: string, user?: string): any;
		reset(ns: string): Promise<void>;
		synced(): Promise<void>;
		environment(userId?: string): Promise<BrowserAgentEnvironment>;
	}

	export function browserAgent(): BrowserAgentInterface;
}
