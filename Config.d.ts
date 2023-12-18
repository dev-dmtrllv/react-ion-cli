type Config = {
    pages: {
        [name: string]: {
            path: string;
            src: string;
        };
    };
    server: {
		src?: string;
        api?: {
			path: string;
			src: string;
		};
        services?: string;
        host?: string;
        port?: number;
        session?: {
            resave?: boolean;
            rolling?: boolean;
            saveUninitialized?: boolean;
            cookie?: {
                maxAge?: number;
                httpOnly?: boolean;
                path?: string;
            };
        };
		database?: boolean;
    };
    output: {
        dir: string;
    };
	resolve?: {
		sources?: string[];
		resources?: string[];
	};
};
