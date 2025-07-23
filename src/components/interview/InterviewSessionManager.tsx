import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Calendar,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { useInterviewSessions } from '@/hooks/useInterviewSessions';
import { toast } from 'sonner';

export const InterviewSessionManager = () => {
  const {
    sessions,
    currentSession,
    loading,
    setCurrentSession,
    deleteSession,
    completeSession,
    fetchSessions
  } = useInterviewSessions();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRefreshSessions = async () => {
    setRefreshing(true);
    try {
      await fetchSessions();
      toast.success('Sessions refreshed');
    } catch (error) {
      toast.error('Failed to refresh sessions');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const success = await deleteSession(sessionId);
    if (success) {
      toast.success('Session deleted successfully');
    } else {
      toast.error('Failed to delete session');
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Calculate final score based on questions answered
    const finalScore = session.questions_answered > 0 
      ? Math.round((session.score || 0) / session.questions_answered * 100) 
      : 0;

    const success = await completeSession(sessionId, finalScore);
    if (success) {
      toast.success('Session completed successfully');
    } else {
      toast.error('Failed to complete session');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (session: any) => {
    return session.total_questions > 0 
      ? (session.questions_answered / session.total_questions) * 100 
      : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Interview Sessions</h2>
        <Button
          onClick={handleRefreshSessions}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RotateCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Current Session */}
      {currentSession && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Current Active Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="font-semibold">{currentSession.session_name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {currentSession.position} at {currentSession.company}
                </span>
                <Badge variant="secondary">{currentSession.difficulty}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentSession.questions_answered} / {currentSession.total_questions} questions</span>
                </div>
                <Progress value={getProgressPercentage(currentSession)} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No interview sessions yet</h3>
            <p className="text-muted-foreground">
              Create your first interview session to start practicing!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{session.session_name}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${getStatusColor(session.status)}`}
                      >
                        {session.status}
                      </Badge>
                      <Badge variant="outline">{session.difficulty}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {session.position} at {session.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Progress:</span>
                        <div className="font-medium">
                          {session.questions_answered} / {session.total_questions}
                        </div>
                      </div>
                      {session.score !== null && (
                        <div>
                          <span className="text-muted-foreground">Score:</span>
                          <div className="font-medium flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {session.score}%
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <div className="font-medium">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {session.status !== 'completed' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(getProgressPercentage(session))}%</span>
                        </div>
                        <Progress value={getProgressPercentage(session)} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {session.status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => setCurrentSession(session)}
                        disabled={currentSession?.id === session.id}
                      >
                        {currentSession?.id === session.id ? 'Current' : 'Resume'}
                      </Button>
                    )}

                    {session.status !== 'completed' && session.questions_answered > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Complete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Complete Session</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to mark this session as completed? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCompleteSession(session.id)}>
                              Complete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Session</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this interview session? 
                            All progress and responses will be permanently lost.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteSession(session.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Storage Management Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Session Management</h4>
              <p className="text-sm text-muted-foreground">
                You can delete old sessions to free up storage space. Completed sessions are automatically 
                archived after 90 days. Active sessions are preserved until manually deleted or completed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};