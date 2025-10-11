// API service for HangHub room management
// For tunnel mode, we need to expose the backend through ngrok too
const API_BASE_URL = (() => {
  // In development
  if (__DEV__) {
    // Use environment variable if set (for ngrok backend)
    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
    
    // Better platform detection for tunnel mode
    // Check if we're running in a browser environment
    const isWeb = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    
    // Also check for React Native specific globals
    const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
    
    // Check for Expo specific environment
    const isExpo = typeof global !== 'undefined' && (global as any).__expo;
    
    // Use ngrok URL for all platforms - works for web, mobile, and team collaboration
    const NGROK_URL = 'https://unopportune-shoaly-sueann.ngrok-free.dev';
    console.log('🌐 Using ngrok backend URL:', NGROK_URL);
    return NGROK_URL;
  }
  
  // Production
  return 'https://your-production-api.com';
})();

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
   * Test API connectivity
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Testing connection to:', API_BASE_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        return { success: false, message: `Server error: ${response.status}` };
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Connection timeout - server may be down' };
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: `Connection failed: ${errorMessage}` };
    }
  }

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
      console.log('Creating room with API URL:', API_BASE_URL);
      console.log('Room data:', roomData);
      
      // Test connection first
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        return {
          success: false,
          message: `Server unavailable: ${connectionTest.message}`
        };
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        return {
          success: false,
          message: `Server error (${response.status}): ${errorText}`
        };
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      console.error('API URL was:', API_BASE_URL);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout - server is taking too long to respond'
        };
      }
      
      return {
        success: false,
        message: `Network error - could not create room. Check if server is running at ${API_BASE_URL}`
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