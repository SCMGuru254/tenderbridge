
// User preferences service functions for the user-preferences edge function
export async function toggleFavorite(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  jobId: string,
  isFavorite: boolean
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/user_job_favorites`, {
      method: isFavorite ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: isFavorite ? JSON.stringify({
        user_id: userId,
        job_id: jobId
      }) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error toggling favorite:', error);
    return { data: null, error: message };
  }
}

export async function setJobReminder(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  jobId: string,
  setReminder: boolean,
  reminderTime?: string
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/job_reminders`, {
      method: setReminder ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: setReminder ? JSON.stringify({
        user_id: userId,
        job_id: jobId,
        reminder_time: reminderTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error setting job reminder:', error);
    return { data: null, error: message };
  }
}

export async function getFavoriteJobs(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/user_job_favorites?user_id=eq.${userId}&select=*,job:job_id(*)`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error getting favorite jobs:', error);
    return { data: null, error: message };
  }
}

export async function getJobReminders(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/job_reminders?user_id=eq.${userId}&select=*,job:job_id(*)`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error getting job reminders:', error);
    return { data: null, error: message };
  }
}

export async function getUserNotifications(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  unreadOnly: boolean = false
) {
  try {
    let url = `${supabaseUrl}/rest/v1/notifications?user_id=eq.${userId}`;
    if (unreadOnly) {
      url += '&is_read=eq.false';
    }

    const response = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error getting notifications:', error);
    return { data: null, error: message };
  }
}

export async function markNotificationAsRead(
  supabaseUrl: string,
  supabaseKey: string,
  notificationId: string,
  userId: string
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/notifications?id=eq.${notificationId}&user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        is_read: true,
        updated_at: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error marking notification as read:', error);
    return { data: null, error: message };
  }
}

export async function createNotification(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  title: string,
  message: string,
  type: string = 'info'
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        user_id: userId,
        title,
        message,
        type,
        is_read: false
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error creating notification:', error);
    return { data: null, error: message };
  }
}
