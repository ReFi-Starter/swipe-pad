
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

export const SELF_APP_ID = "swipe-pad-verification"; // Placeholder

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

export const generateSelfDeepLink = (request: SelfRequest): string => {
    const payload = Buffer.from(JSON.stringify(request)).toString("base64");
    return `https://selfid.net/r/${payload}`; // Standard Self deep link format
};

export const generateSelfQRCodeData = (request: SelfRequest): string => {
    return JSON.stringify(request);
}
