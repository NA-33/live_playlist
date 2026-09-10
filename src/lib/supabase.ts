import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mock implementation for testing when env vars are missing
const createMockClient = () => {
  console.warn("⚠️ Supabase keys missing. Using Mock Client for testing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local for real database connectivity.");

  return {
    auth: {
      getSession: async () => {
        const user = localStorage.getItem('mock-user');
        return {
          data: {
            session: user ? {
              user: JSON.parse(user),
              access_token: 'mock-token',
              expires_at: Date.now() + 3600000
            } : null
          },
          error: null
        };
      },
      signInWithPassword: async ({ email, password }: any) => {
        if (email && password) {
          const user = { id: 'mock-id', email };
          localStorage.setItem('mock-user', JSON.stringify(user));
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: "Invalid credentials" } };
      },
      signUp: async ({ email, password }: any) => {
        const user = { id: 'mock-id', email };
        localStorage.setItem('mock-user', JSON.stringify(user));
        return { data: { user }, error: null };
      },
      signInWithOAuth: async ({ provider }: any) => {
        const user = { id: 'mock-id', email: 'google-user@gmail.com' };
        localStorage.setItem('mock-user', JSON.stringify(user));
        return { data: { user }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('mock-user');
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        // Simulate an immediate auth state change check
        const user = localStorage.getItem('mock-user');
        const session = user ? { user: JSON.parse(user) } : null;
        callback('INITIAL_SESSION', session);

        return {
          data: {
            subscription: {
              unsubscribe: () => {
                console.log("Mock auth subscription unsubscribed");
              },
            },
          },
        };
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: any) => ({
          then: async () => ({ data: [], error: null }),
          // Simulating empty data for the mock
        }),
      }),
      insert: (data: any) => ({
        then: async () => ({ data: data, error: null }),
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          then: async () => ({ error: null }),
        }),
      }),
    }),
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
