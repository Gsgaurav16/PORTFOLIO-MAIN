
import SectionWrapper from '../ui/SectionWrapper';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ArrowRight, Terminal, Code, Sparkles } from 'lucide-react';
import characterImg from '../../assets/tv-character.webp';
import { usePortfolioStore } from '../../store/useStore';

const Hero = () => {
    const { profile } = usePortfolioStore();

    return (
        <SectionWrapper id="home" className="min-h-[80vh] flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">

                {/* Left Side: Content */}
                <div className="flex flex-col gap-6 order-2 lg:order-1">
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="accent">Available for Hire</Badge>
                        <Badge variant="outline">v2.0.24</Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight">
                        Hi, I’m <span className="text-retro-orange">{profile.name}</span> <br />
                        <span className="text-deep-green stroke-text">{profile.role}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-retro-dark/80 max-w-lg font-medium">
                        {profile.bio}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <Button
                            size="lg"
                            className="flex items-center gap-2 justify-center"
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View Projects <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="flex items-center gap-2 justify-center"
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Contact Me <Terminal className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 mt-8 bg-white p-4 rounded-xl border-3 border-retro-dark shadow-retro-sm">
                        <div className="text-center">
                            <div className="text-2xl font-display text-retro-orange">{profile.years}</div>
                            <div className="text-xs uppercase tracking-wider font-bold text-gray-500">Years Exp</div>
                        </div>
                        <div className="text-center border-l-2 border-gray-100">
                            <div className="text-2xl font-display text-retro-teal">{profile.projects_count}</div>
                            <div className="text-xs uppercase tracking-wider font-bold text-gray-500">Projects</div>
                        </div>
                        <div className="text-center border-l-2 border-gray-100">
                            <div className="text-2xl font-display text-deep-green">{profile.awesomeness}</div>
                            <div className="text-xs uppercase tracking-wider font-bold text-gray-500">Awesomeness</div>
                        </div>
                    </div>

                    {/* Chips */}
                    <div className="flex gap-2 flex-wrap text-sm font-display text-gray-500 mt-2">
                        {profile.expertise.map((skill, index) => (
                            <span key={skill} className="flex items-center gap-1">
                                {index > 0 && <span className="mr-1">•</span>}
                                {index === 0 && <Code className="w-4 h-4" />}
                                {index === 1 && <Terminal className="w-4 h-4" />}
                                {index === 2 && <Sparkles className="w-4 h-4" />}
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Side: Character */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">

                    {/* Card Frame */}
                    <div className="relative z-10 bg-white p-4 rounded-xl border-3 border-retro-dark shadow-retro-lg rotate-2 hover:rotate-0 transition-transform duration-300 max-w-md w-full">
                        <div className="bg-pastel-yellow border-2 border-retro-dark rounded-lg overflow-hidden aspect-[4/5] relative flex items-end justify-center">
                            <img
                                src={characterImg}
                                alt="Gaurav Character Avatar"
                                fetchPriority="high"
                                loading="eager"
                                width="341"
                                height="341"
                                className="w-full h-full object-cover object-center scale-110 translate-y-4"
                            />

                            {/* Floating Badge on Image */}
                            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full border-2 border-retro-dark text-xs font-display shadow-sm">
                                Lvl. 99
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-display text-lg">Player: {profile.name}</h3>
                                <p className="text-xs text-gray-500 uppercase">Click to view stats</p>
                            </div>
                            <Gamepad2Icon />
                        </div>
                    </div>

                    {/* Background Decor Elements */}
                    <div className="absolute top-10 right-10 w-full h-full bg-deep-green rounded-xl border-3 border-retro-dark -z-10 rotate-6 opacity-20 scale-105"></div>
                </div>

            </div>
        </SectionWrapper>
    );
};

const Gamepad2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-retro-orange">
        <line x1="6" x2="10" y1="12" y2="12" />
        <line x1="8" x2="8" y1="10" y2="14" />
        <line x1="15" x2="15.01" y1="13" y2="13" />
        <line x1="18" x2="18.01" y1="11" y2="11" />
        <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
)

export default Hero;
