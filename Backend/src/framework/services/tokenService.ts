import { ITokenService } from "../../domain/interfaces/serviceInterface/ITokenService";
import { IjwtInterface } from "../../domain/interfaces/serviceInterface/IjwtService";
import jwt from "jsonwebtoken";

export class TokenService implements ITokenService {
    private jwtService: IjwtInterface;
    private readonly RESET_SECRET_KEY: string;
    private usedTokens: Set<string> = new Set(); // To prevent token reuse

    constructor(jwtService: IjwtInterface) {
        this.jwtService = jwtService;
        this.RESET_SECRET_KEY = process.env.RESET_TOKEN_SECRET_KEY || 'reset-secret-key';
    }

    generateResetToken(email: string): string {
        // Create a JWT token with email and purpose
        const payload = { 
            email, 
            purpose: 'password-reset',
            timestamp: Date.now() // Add timestamp for uniqueness
        };
        
        return jwt.sign(payload, this.RESET_SECRET_KEY, { expiresIn: '1h' });
    }

    async storeResetToken(email: string, token: string): Promise<void> {
        // With JWT, we don't need to store tokens as they are self-contained
        // Just verify the token is valid
        const isValid = await this.verifyResetToken(email, token);
        if (!isValid) {
            throw new Error('Invalid reset token generated');
        }
    }

    async verifyResetToken(email: string, token: string): Promise<boolean> {
        try {
            // Check if token was already used
            if (this.usedTokens.has(token)) {
                return false;
            }

            const decoded = jwt.verify(token, this.RESET_SECRET_KEY) as {
                email: string;
                purpose: string;
                timestamp: number;
            };

            // Verify the token is for the correct email and purpose
            return decoded.email === email && decoded.purpose === 'password-reset';
        } catch (error) {
            return false;
        }
    }

    async deleteResetToken(email: string, token: string): Promise<void> {
        // Mark token as used to prevent reuse
        this.usedTokens.add(token);
        
        // Optional: Clean old used tokens periodically
        this.cleanUsedTokens();
    }

    private cleanUsedTokens(): void {
        // Clean used tokens older than 2 hours
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        
        for (const token of this.usedTokens) {
            try {
                const decoded = jwt.decode(token) as { timestamp: number };
                if (decoded && decoded.timestamp < twoHoursAgo) {
                    this.usedTokens.delete(token);
                }
            } catch (error) {
                // If token can't be decoded, remove it
                this.usedTokens.delete(token);
            }
        }
    }
}