import { getConnection } from '../config/database';
import { ProfileDto } from '../models/Profile';

export class ProfileRepository {
    async getProfile(userId: number): Promise<ProfileDto> {
        const connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT profiles.id, profiles.username, profiles.created_at, profiles.updated_at FROM profiles WHERE user_id = ?',
                [userId]
            );
            
            if (!rows || (rows as any[]).length === 0) {
                const [users] = await connection.execute(
                    'SELECT id, username, created_at, updated_at FROM users WHERE id = ?',
                    [userId]
                );
                
                if (!users || (users as any[]).length === 0) {
                    throw new Error('User not found');
                }
                
                const user = (users as any[])[0];
                const [result] = await connection.execute(
                    'INSERT INTO profiles (user_id, username, created_at, updated_at) VALUES (?, ?, ?, ?)',
                    [userId, user.username, user.created_at, user.updated_at]
                );
                
                const profileId = (result as any).insertId;
                
                return {
                    id: profileId,
                    username: user.username,
                    created_at: this.formatDate(user.created_at),
                    updated_at: this.formatDate(user.updated_at)
                };
            }
            
            const profile = (rows as any[])[0];
            return {
                id: profile.id,
                username: profile.username,
                created_at: this.formatDate(profile.created_at),
                updated_at: this.formatDate(profile.updated_at)
            };
        } finally {
            await connection.release();
        }
    }

    async updateProfile(profileId: number, data: { username: string }): Promise<ProfileDto> {
        const connection = await getConnection();
        try {
            const [profiles] = await connection.execute(
                'SELECT id, user_id, username, created_at, updated_at FROM profiles WHERE id = ?',
                [profileId]
            );
            
            if (!profiles || (profiles as any[]).length === 0) {
                throw new Error('Profile not found');
            }

            await connection.execute(
                'UPDATE profiles SET username = ? WHERE id = ?',
                [data.username, profileId]
            );
            
            const [updatedProfiles] = await connection.execute(
                'SELECT id, username, created_at, updated_at FROM profiles WHERE id = ?',
                [profileId]
            );
            
            const profile = (updatedProfiles as any[])[0];
            return {
                id: profile.id,
                username: profile.username,
                created_at: this.formatDate(profile.created_at),
                updated_at: this.formatDate(profile.updated_at)
            };
        } finally {
            await connection.release();
        }
    }
    
    private formatDate(date: Date): string {
        return new Date(date).toISOString();
    }
} 