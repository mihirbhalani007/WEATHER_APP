import { AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

interface ErrorAlertProps {
    title: string;
    description: string;
    onRetry: () => void;
    buttonText?: string;
}

const ErrorAlert = ({ title, description, onRetry, buttonText = 'Retry' }: ErrorAlertProps) => (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
            <p>{description}</p>
            <Button onClick={onRetry} variant="outline" className="w-fit mt-2">
                {buttonText === 'Retry' ? <RefreshCw className="mr-2 h-4 w-4" /> : <MapPin className="mr-2 h-4 w-4" />}
                {buttonText}
            </Button>
        </AlertDescription>
    </Alert>
);

export default ErrorAlert;
