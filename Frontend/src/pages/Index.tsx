import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mic, Languages, Play, Star, Users, Crown, TrendingUp, Zap, Gamepad2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import sacredOmMandala from "@/assets/sacred-om-mandala.jpg";
import { Navigation } from "@/components/Navigation";


const Index = () => {

  const quickLinks = [
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Interactive Lessons",
      description: "Structured learning path from script to fluency",
      link: "/lessons",
      color: "sacred-gold"
    },
    {
      icon: <Gamepad2 className="w-12 h-12" />,
      title: "Learning Games",
      description: "Master Sanskrit through fun, interactive games",
      link: "/games",
      color: "lotus-pink"
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "Quizzes",
      description: "Test your knowledge with real-time scoring",
      link: "/quiz",
      color: "temple-bronze"
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Fun Activities",
      description: "Engaging exercises and Sanskrit stories",
      link: "/activities",
      color: "sacred-gold"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Live Progress",
      description: "Track your learning journey in real-time",
      link: "/progress",
      color: "lotus-pink"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Community",
      description: "Learn together with fellow enthusiasts",
      link: "/social",
      color: "temple-bronze"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <img 
            src={sacredOmMandala} 
            alt="Sacred Om Mandala" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-sacred-gold/10 text-sacred-gold border-sacred-gold/30 animate-gentle-float">
              Ancient Wisdom • Modern Technology
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-cinzel font-bold mb-6 text-sacred bg-gradient-to-r from-sacred-gold to-temple-bronze bg-clip-text text-transparent animate-fade-in-up">
              संस्कृत गुरु
            </h1>
            
            <h2 className="text-2xl lg:text-4xl font-cinzel mb-6 text-manuscript-cream animate-fade-in-up [animation-delay:0.2s]">
              Sanskrit Language Tutor
            </h2>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-up [animation-delay:0.4s]">
              Master the sacred language of the Vedas with AI-powered pronunciation assessment, 
              interactive lessons, and real-time translation. Journey from script to conversation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:0.6s]">
              <Link to="/lessons">
                <Button size="lg" className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90 font-semibold px-8 py-4 text-lg shadow-sacred">
                  <Play className="w-5 h-5 mr-2" />
                  Begin Learning Journey
                </Button>
              </Link>
              <Link to="/games">
                <Button size="lg" variant="outline" className="border-sacred-gold text-sacred-gold hover:bg-sacred-gold/10 font-semibold px-8 py-4 text-lg">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Try Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-cinzel font-bold text-sacred-gold mb-4">Explore Learning Modules</h3>
            <p className="text-muted-foreground text-lg">Choose your path to Sanskrit mastery</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.link}>
                <Card className={`card-vedic p-6 h-full hover:shadow-sacred transition-all duration-300 group cursor-pointer border-${link.color}/20`}>
                  <div className={`text-${link.color} mb-4 flex justify-center group-hover:animate-gentle-float`}>
                    {link.icon}
                  </div>
                  <h4 className="font-cinzel font-semibold text-xl mb-3 text-manuscript-cream text-center">
                    {link.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-center">{link.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default Index;