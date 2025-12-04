
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
    // The QR code should encode the Deep Link URL so that scanning it with a standard camera
    // opens the browser and redirects to the app (Universal Link).
    return generateSelfDeepLink(request);
}

export const generateSelfDeepLink = (request: SelfRequest): string => {
    // Self expects the request to be base64 encoded.
    // We use a universal link: https://selfid.net/r/{base64_request}
    const jsonString = JSON.stringify(request);
    let base64 = "";
    
    if (typeof window !== 'undefined') {
        base64 = btoa(jsonString);
    } else {
        base64 = Buffer.from(jsonString).toString('base64');
    }
    
    // Make URL safe if necessary, though standard base64 usually works with selfid.net/r/
    // replacing + with - and / with _ and removing =
    const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return `https://selfid.net/r/${urlSafeBase64}`;
}
