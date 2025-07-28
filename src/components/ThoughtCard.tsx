import { Quote, Lightbulb } from 'lucide-react';
import { useThoughts } from '@/components/hooks/useSupabaseData';

const ThoughtCard = () => {
  const { thought: thoughtData, isLoading } = useThoughts();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-xl text-center animate-fade-in delay-300">
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-muted rounded-full mx-auto mb-6"></div>
              <div className="h-6 bg-muted rounded mb-4 mx-auto w-3/4"></div>
              <div className="h-4 bg-muted rounded mb-6 mx-auto w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const thought = thoughtData?.thought || "Excellence is not a skill, it's an attitude. Every champion was once a contender who refused to give up. Keep pushing your limits and success will follow.";
  const author = thoughtData?.author || "Coach Thompson";
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 rounded-xl text-center animate-fade-in delay-300">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <Quote className="h-8 w-8 text-primary/30 mx-auto mb-4" />
          
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed mb-6">
            "{thought}"
          </blockquote>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="h-px bg-gradient-primary w-12"></div>
            <cite className="text-primary font-semibold text-lg not-italic">
              — {author}
            </cite>
            <div className="h-px bg-gradient-primary w-12"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThoughtCard;