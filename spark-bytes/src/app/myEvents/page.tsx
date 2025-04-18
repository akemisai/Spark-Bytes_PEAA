'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyEventsPage() {
  interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    building_index: string;
    latitude: number;
    longitude: number;
    status: string;
    created_by: string;
    created_at: string;
  }

  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyEvents() {
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', session.user.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user-created events:', error.message);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }

    fetchMyEvents();
  }, [session]);

  // 🔴 This function handles deleting an event by its ID
  const handleDelete = async (id: string) => {
    // Show a browser confirmation prompt before deleting
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (!confirm) return;

    // Call Supabase to delete the event from the 'events' table
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      // If there's an error, log it to the console
      console.error('Error deleting event:', error.message);
    } else {
      // If deletion is successful, update local state to remove the event from the UI
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Events</h1>

      {session && (
        <button
          onClick={() => router.push('/addEvent')}
          style={{
            backgroundColor: '#c00',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
        >
          Add Event
        </button>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(event => (
          <li key={event.id} style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Location:</strong> {event.location} ({event.building_index})</p>
            <p><strong>Status:</strong> {event.status}</p>
            <p><strong>Created At:</strong> {new Date(event.created_at).toLocaleString()}</p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {/* ✏️ Button to navigate to the edit page */}
              <button
                onClick={() => router.push(`/editEvent/${event.id}`)}
                style={{
                  backgroundColor: '#c00',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit Event
              </button>

              {/* Button to delete this event, when clicked triggers handleDelete function */}
              <button
                onClick={() => handleDelete(event.id)}
                style={{
                  backgroundColor: '#c00',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete Event
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
