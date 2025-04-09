import { Request, Response } from 'express';
import { ProfileRepository } from '../repositories/ProfileRepository';

export class ProfileController {
    private profileRepository: ProfileRepository;

    constructor() {
        this.profileRepository = new ProfileRepository();
    }

    getProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const profile = await this.profileRepository.getProfile(userId);
            res.json(profile);
        } catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({ error: 'Failed to get profile' });
        }
    };

    updateProfile = async (req: Request, res: Response) => {
        try {
            const profileId = parseInt(req.params.id, 10);
            if (isNaN(profileId)) {
                return res.status(400).json({ error: 'Invalid profile ID' });
            }
            
            const { username } = req.body;
            if (!username) {
                return res.status(400).json({ error: 'Username is required' });
            }
            
            const profile = await this.profileRepository.updateProfile(profileId, {
                username
            });
            
            res.json(profile);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    };
} 