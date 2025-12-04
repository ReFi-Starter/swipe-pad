
export interface SelfFactRequest {
    fact: string;
    operator?: string;
    value?: string | number | boolean;
    sources?: string[];
}

export interface SelfRequest {
    typ: string;
    type: string;
    facts: SelfFactRequest[];
    callback?: string;
    expiry?: number;
}

export const createAgeVerificationRequest = (callbackUrl?: string): SelfRequest => {
    return {
        typ: "identity-request",
        type: "identity-request",
        facts: [
            {
                fact: "is_over_18",
                operator: "==",
                value: true,
                sources: ["passport", "driving_license", "identity_card"]
            }
        ],
        callback: callbackUrl,
        expiry: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    };
};

export const generateSelfQRCodeData = (request: SelfRequest): string => {
    return JSON.stringify(request);
}
