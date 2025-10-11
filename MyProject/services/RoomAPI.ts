// API service for HangHub room management
// Use your network IP for mobile testing, localhost for web
const API_BASE_URL = __DEV__ 
  ? (typeof window !== 'undefined' ? 'http://localhost:3000' : 'http://172.16.0.251:3000')
  : 'http://localhost:3000';

export interface Room {
  _id: string;
  roomCode: string;
  hangoutName: string;
  location: string;
  date?: Date;
  time?: Date;
  groupSize: number;
  hostName: string;
  status: 'waiting' | 'preferences' | 'swiping' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
  preferences: RoomPreferences;
  activities: RoomActivities;
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  status: 'ready' | 'joining' | 'preferences' | 'swiping' | 'completed';
  joinedAt: Date;
  preferences?: UserPreferences;
  swipedActivities: string[];
}

export interface UserPreferences {
  maxDistance: number;
  budget: number;
  drivingWillingness: number;
  groupSize: number;
  timeFlexibility: number;
}

export interface RoomPreferences {
  maxDistance: number[];
  budget: number[];
  drivingWillingness: number[];
  groupSize: number[];
  timeFlexibility: number[];
}

export interface RoomActivities {
  liked: string[];
  passed: string[];
  matches: string[];
}

export interface RoomStats {
  participantCount: number;
  completedParticipants: number;
  averagePreferences: {
    maxDistance: number;
    budget: number;
    drivingWillingness: number;
    groupSize: number;
    timeFlexibility: number;
  };
  activityStats: {
    totalLikes: number;
    totalPasses: number;
    popularActivities: Record<string, number>;
  };
}

class RoomAPI {
  /**
   * Create a new hangout room
   */
  static async createRoom(roomData: {
    hangoutName: string;
    location: string;
    date?: Date;
    time?: Date;
    groupSize: number;
    hostName: string;
  }): Promise<{ success: boolean; roomCode?: string; roomId?: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      return {
        success: false,
        message: 'Network error - could not create room'
      };
    }
  }

  /**
   * Join an existing room
   */
  static async joinRoom(roomCode: string, userName: string): Promise<{ 
    success: boolean; 
    participant?: Participant; 
    message?: string 
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error joining room:', error);
      return {
        success: false,
        message: 'Network error - could not join room'
      };
    }
  }

  /**
   * Get room information
   */
  static async getRoomInfo(roomCode: string): Promise<{
    success: boolean;
    room?: Room;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching room info:', error);
      return {
        success: false,
        message: 'Network error - could not fetch room info'
      };
    }
  }

  /**
   * Update participant preferences
   */
  static async updatePreferences(
    roomCode: string, 
    participantId: string, 
    preferences: UserPreferences
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${roomCode}/participants/${participantId}/preferences`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return {
        success: false,
        message: 'Network error - could not update preferences'
      };
    }
  }

  /**
   * Submit activity swipes
   */
  static async submitSwipes(
    roomCode: string,
    participantId: string,
    likedActivities: string[],
    passedActivities: string[]
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${roomCode}/participants/${participantId}/swipes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ likedActivities, passedActivities }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting swipes:', error);
      return {
        success: false,
        message: 'Network error - could not submit swipes'
      };
    }
  }

  /**
   * Get room statistics
   */
  static async getRoomStats(roomCode: string): Promise<{
    success: boolean;
    stats?: RoomStats;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching room stats:', error);
      return {
        success: false,
        message: 'Network error - could not fetch statistics'
      };
    }
  }

  /**
   * Poll for room updates (for real-time-like experience)
   */
  static async pollRoomUpdates(
    roomCode: string, 
    onUpdate: (room: Room) => void,
    intervalMs: number = 3000
  ): Promise<() => void> {
    const poll = async () => {
      const result = await this.getRoomInfo(roomCode);
      if (result.success && result.room) {
        onUpdate(result.room);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const intervalId = setInterval(poll, intervalMs);
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

export default RoomAPI;