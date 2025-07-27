import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, Video, Download, Heart, Share2, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  category: string;
  date: string;
  event: string;
  likes: number;
  views: number;
  description?: string;
}

const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Championship Victory Celebration',
    type: 'photo',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    category: 'Football',
    date: '2024-03-15',
    event: 'Inter-House Football Final',
    likes: 45,
    views: 320,
    description: 'Blue Dragons celebrating their championship victory'
  },
  {
    id: '2',
    title: 'Basketball Tournament Highlights',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/400/300',
    category: 'Basketball',
    date: '2024-03-10',
    event: 'Annual Basketball Tournament',
    likes: 67,
    views: 450,
    description: 'Best moments from the basketball tournament'
  },
  {
    id: '3',
    title: 'Cricket Match Action',
    type: 'photo',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    category: 'Cricket',
    date: '2024-03-08',
    event: 'House Cricket Match',
    likes: 32,
    views: 280,
    description: 'Intense cricket match between Red and Green houses'
  },
  {
    id: '4',
    title: 'Swimming Championship',
    type: 'photo',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    category: 'Swimming',
    date: '2024-03-05',
    event: 'Swimming Gala 2024',
    likes: 28,
    views: 195,
    description: 'Athletes showcasing their swimming prowess'
  },
  {
    id: '5',
    title: 'Track and Field Highlights',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/api/placeholder/400/300',
    category: 'Athletics',
    date: '2024-03-01',
    event: 'Sports Day 2024',
    likes: 89,
    views: 567,
    description: 'Amazing athletic performances from Sports Day'
  },
  {
    id: '6',
    title: 'Volleyball Team Victory',
    type: 'photo',
    url: '/api/placeholder/800/600',
    thumbnail: '/api/placeholder/400/300',
    category: 'Volleyball',
    date: '2024-02-28',
    event: 'Volleyball Championships',
    likes: 41,
    views: 312,
    description: 'Yellow Eagles volleyball team after their victory'
  }
];

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(mockGalleryItems.map(item => item.category)))];

  const filteredItems = selectedCategory === 'all' 
    ? mockGalleryItems 
    : mockGalleryItems.filter(item => item.category === selectedCategory);

  const photos = filteredItems.filter(item => item.type === 'photo');
  const videos = filteredItems.filter(item => item.type === 'video');

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Sports Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Relive the most exciting moments from our sports events and competitions
            </p>
          </div>

          {/* Category Filter */}
          <div className="glass-card p-4 rounded-xl mb-8 animate-fade-in delay-200">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-primary" : ""}
                >
                  {category === 'all' ? 'All Sports' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Gallery Tabs */}
          <Tabs defaultValue="photos" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 glass-card">
              <TabsTrigger value="photos" className="flex items-center space-x-2">
                <Camera size={20} />
                <span>Photos ({photos.length})</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-2">
                <Video size={20} />
                <span>Videos ({videos.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((item, index) => (
                  <div
                    key={item.id}
                    className="sport-card cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => openLightbox(item)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Camera size={48} className="text-muted-foreground" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <Eye className="text-white" size={32} />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.event}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((item, index) => (
                  <div
                    key={item.id}
                    className="sport-card cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => openLightbox(item)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Video size={48} className="text-muted-foreground" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Video className="text-primary ml-1" size={24} />
                        </div>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.event}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedItem && (
            <div className="glass-card rounded-xl overflow-hidden">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-xl font-heading">
                  {selectedItem.title}
                </DialogTitle>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{selectedItem.event}</span>
                  <span>{formatDate(selectedItem.date)}</span>
                </div>
              </DialogHeader>
              
              <div className="px-6">
                {selectedItem.type === 'photo' ? (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Camera size={64} className="text-muted-foreground" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Video size={64} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="p-6 pt-4">
                {selectedItem.description && (
                  <p className="text-muted-foreground mb-4">
                    {selectedItem.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Heart size={16} />
                      <span>{selectedItem.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Eye size={16} />
                      <span>{selectedItem.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Share2 size={16} className="mr-2" />
                      Share
                    </Button>
                    <Button size="sm" className="btn-primary">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Gallery;
