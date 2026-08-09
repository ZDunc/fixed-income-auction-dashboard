import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

interface DashboardErrorStateProps {
    error: string | null;
    onRetry: () => void;
}

export function DashboardErrorState({
    error,
    onRetry
}: DashboardErrorStateProps) {
    return (
        <Card
            variant="outlined"
            sx={{
                gridRow: '1 / -1',
                minHeight: 0,
                p: 2,
                borderRadius: 2
            }}>
            <Alert
                severity="error"
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={onRetry}>
                        Retry
                    </Button>
                }>
                <AlertTitle>
                    Unable to load auctions
                </AlertTitle>

                {error ??
                    'An unexpected error occurred while loading auction data.'}
            </Alert>
        </Card>
    );
}

interface DashboardRefreshErrorProps {
    onRetry: () => void;
}

export function DashboardRefreshError({
    onRetry
}: DashboardRefreshErrorProps) {
    return (
        <Alert
            severity="error"
            variant="outlined"
            action={
                <Button
                    color="inherit"
                    size="small"
                    onClick={onRetry}>
                    Retry
                </Button>
            }
            sx={{
                alignItems: 'center',
                bgcolor: 'background.paper'
            }}>
            Unable to update auctions. Previous results are still shown.
        </Alert>
    );
}