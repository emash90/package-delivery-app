import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  text?: string;
}

const BackButton = ({ className, text = 'Back to Dashboard' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {text}
      </Button>
    </div>
  );
};

export default BackButton;