declare module '@knowlearning/agents/browser.js' {
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

	export interface AgentUploadInfo {
		name?: string,
		type?: string,
		data?: string | ArrayBuffer,
		id: string,
		browser?: boolean,
		accept?: string,
	}

	export interface BrowserAgentInterface {
		login(provider: string): void;
		logout(): void;
		uuid(): string;
		state(id: string, user?: string, domain?: string): Promise<object>;
		metadata(id: string, user?: string, domain?: string): Promise<object>;
		watch(id: string, callback: (update: { state: object }) => void, user?: string, domain?: string): void;
		upload(info?: AgentUploadInfo): Promise<string>;
		download(id?: string): Promise<Response>;
		reset(ns: string): Promise<void>;
		synced(): Promise<void>;
		environment(userId?: string): Promise<BrowserAgentEnvironment>;
	}

	const browserAgent: BrowserAgentInterface;
	export default browserAgent;
}