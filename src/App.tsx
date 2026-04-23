import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Activity, 
  Cpu, 
  Database, 
  Network, 
  Shield, 
  Terminal as TerminalIcon, 
  Zap, 
  Settings, 
  Bot,
  AlertCircle,
  CheckCircle2,
  Lock,
  Wifi,
  Battery,
  HardDrive,
  BarChart3,
  Smartphone,
  Search,
  Layers,
  Globe,
  Box,
  Command,
  ChevronDown
} from 'lucide-react';

// --- TYPES ---
interface ProcessNode {
  pid: number;
  ppid: number;
  name: string;
  cpu: number;
  children?: ProcessNode[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  message: string;
}

interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// --- COMPONENTS ---

const BootOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    "SINGULARITY HYPERVISOR v5.0 // ANDROID 16 EDITION",
    "POLLING ANDROID 16 DEBIAN_TERMINAL BRIDGE... CONNECTED",
    "ESTABLISHING USER-SPACE TUNNEL (U-ST)...",
    "UID 1000 -> ROOT BRIDGE: STABLE (NO_ROOT_REQUIRED)",
    "VIRTUALIZING PIXEL 10 PRO HARDWARE STACK...",
    "MAPPING KERNEL SYSCALLS TO DEBIAN_TERMINAL_V2...",
    "LOADING NETHUNTER ONE-CLICK COMMAND HUB...",
    "UBUNTU TOUCH / DEBIAN MOBILE SB_IMAGE: READY",
    "BYPASSING KERNEL_LOCK_V3... SUCCESS",
    "SINGULARITY CORE ACTIVE: PEAK PERFORMANCE MODE."
  ];

  useEffect(() => {
    if (stage < stages.length) {
      const timer = setTimeout(() => setStage(s => s + 1), 200 + Math.random() * 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8 font-mono select-none"
    >
      <div className="max-w-2xl w-full">
        {stages.slice(0, stage).map((text, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-1 text-sm ${i === stages.length - 1 ? 'text-singularity-accent font-bold mt-4' : 'text-singularity-muted'}`}
          >
            <span className="mr-4">[{new Date().toLocaleTimeString('en-GB')}]</span>
            {text}
          </motion.div>
        ))}
        {stage < stages.length && (
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-2 h-4 bg-singularity-accent inline-block ml-1 align-middle"
          />
        )}
      </div>
    </motion.div>
  );
};

interface ConsoleProps {
  logs: LogEntry[];
  command: string;
  setCommand: (val: string) => void;
  onCommand: (e: React.FormEvent) => void;
  history: string[];
  historyIndex: number;
  setHistoryIndex: (val: number) => void;
}

const Console: React.FC<ConsoleProps> = ({ logs, command, setCommand, onCommand, history, historyIndex, setHistoryIndex }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-none overflow-hidden flex flex-col h-full font-mono text-[11px] backdrop-blur-xl shadow-2xl relative">
      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center gap-2 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <TerminalIcon size={12} className="text-singularity-accent" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">System Terminal</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center opacity-40">
            <div className="w-1 h-1 bg-white" />
            <div className="w-1 h-1 bg-white" />
            <div className="w-1 h-1 bg-singularity-accent" />
            <span className="ml-2 text-[9px] font-bold tracking-widest">A16_OPTIMIZED</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onCommand({ preventDefault: () => {}, target: { value: 'clear' } } as any);
            }}
            className="text-[9px] uppercase font-bold text-white/20 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-2 pb-10 scrollbar-hide">
        {logs.length === 0 && (
          <div className="text-white/10 italic text-[10px] uppercase tracking-widest text-center mt-10">
            -- Persistent Log Stream Empty --
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 group">
            <span className="opacity-20 whitespace-nowrap select-none group-hover:opacity-40 transition-opacity">{log.timestamp}</span>
            <span className={`
              ${log.type === 'error' ? 'text-singularity-danger font-bold' : ''}
              ${log.type === 'success' ? 'text-singularity-success' : ''}
              ${log.type === 'warning' ? 'text-yellow-500' : ''}
              ${log.type === 'info' ? 'text-singularity-accent' : ''}
              ${log.type === 'system' ? 'text-white/60 font-light italic' : ''}
            `}>
              {log.type === 'system' ? `// ${log.message}` : `[root@kernel] > ${log.message}`}
            </span>
          </div>
        ))}
      </div>
      <div className="px-6 pb-6 pt-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent">
        <form onSubmit={onCommand} className="flex items-center gap-3 border-t border-white/5 pt-4">
          <span className="text-singularity-accent opacity-40 select-none tracking-tighter">root@kernel:~$</span>
          <input 
            type="text" 
            value={command}
            onKeyDown={handleKeyDown}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-singularity-text focus:ring-0 placeholder-white/5 text-[11px]"
            placeholder="Type 'help' for instructions..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: SystemMetric;
  icon: any;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, icon: Icon }) => (
  <div className="group border-l border-white/10 pl-6 py-2 transition-all">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-singularity-muted group-hover:text-singularity-accent transition-colors">
        {metric.label}
      </h3>
      <span className="text-[10px] opacity-30 uppercase font-mono tracking-widest group-hover:opacity-100 transition-opacity">
        {metric.trend === 'up' ? 'Increase_Detected' : 'Optimization_Stable'}
      </span>
    </div>
    <div className="flex items-baseline gap-2 mb-4">
      <span className="text-4xl font-light tracking-tighter transition-all group-hover:text-white">
        {metric.label === 'VRAM' ? `${metric.value}GB` : `${metric.value}${metric.unit}`}
      </span>
      <span className="text-[10px] opacity-40 uppercase tracking-widest font-bold">
        {metric.label === 'VRAM' ? 'Hyper Transfer' : 'Peak Frequency'}
      </span>
    </div>
    <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(metric.value / (metric.label === 'VRAM' ? 16 : 100)) * 100}%` }}
        className={`h-full absolute top-0 left-0 transition-all ${
          metric.label === 'Core Load' ? 'bg-singularity-accent glow-accent' : 
          metric.label === 'VRAM' ? 'bg-singularity-secondary glow-secondary' : 
          metric.label === 'Neural Link' ? 'bg-singularity-success glow-success' : 'bg-white glow-accent'
        }`}
      />
    </div>
  </div>
);

interface ModuleToggleProps {
  label: string;
  active: boolean;
  description: string;
  onToggle: () => void;
}

const ModuleToggle: React.FC<ModuleToggleProps> = ({ label, active, description, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`w-full text-left px-5 py-4 border-l-2 transition-all duration-300 flex items-center justify-between group ${
      active 
        ? 'bg-white/[0.04] border-singularity-accent opacity-100' 
        : 'bg-transparent border-white/5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-white/20'
    }`}
  >
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1 transition-colors group-hover:text-white">
        {label}
      </div>
      <div className="text-[9px] opacity-40 uppercase tracking-widest font-mono italic">
        {description}
      </div>
    </div>
    <div className={`w-8 h-8 flex items-center justify-center transition-all ${active ? 'text-singularity-accent scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-white/20'}`}>
      {active ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
    </div>
  </button>
);

const ProcessMatrix = () => {
  const [data, setData] = useState<number[]>([]);
  
  useEffect(() => {
    setData(Array.from({ length: 48 }, () => Math.floor(Math.random() * 100)));
    const interval = setInterval(() => {
      setData(prev => prev.map(v => Math.max(0, Math.min(100, v + (Math.random() - 0.5) * 20))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-8 gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
      {data.map((val, i) => (
        <div key={i} className="h-1 bg-white/5 relative overflow-hidden">
          <motion.div 
            animate={{ height: `${val}%` }}
            className={`absolute bottom-0 left-0 w-full ${val > 80 ? 'bg-singularity-danger glow-danger' : 'bg-singularity-accent opacity-50'}`}
          />
        </div>
      ))}
    </div>
  );
};

interface HistoricalData {
  time: string;
  cpu: number;
  memory: number;
  network: number;
  disk: number;
}

interface OSInstance {
  id: string;
  name: string;
  kernel: string;
  status: 'active' | 'suspended' | 'offline';
  icon: any;
  hwMapping: string[];
}

interface NethunterTool {
  id: string;
  name: string;
  category: 'Wireless' | 'Exploitation' | 'Sniffing' | 'Forensics' | 'Social' | 'Web';
  command: string;
  description: string;
  icon: any;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'gemini';
  content: string;
  timestamp: string;
}

interface UserPreferences {
  defaultShell: 'bash' | 'zsh' | 'fish' | 'sh';
  theme: 'dark' | 'amoled' | 'brutalist' | 'hacker';
  notifications: boolean;
  autoHeal: boolean;
  healerSensitivity: number;
  tunnelEfficiency: number;
}

const NethunterHub: React.FC<{ onExecute: (tool: NethunterTool) => void }> = ({ onExecute }) => {
  const tools: NethunterTool[] = [
    { id: 'wifite', name: 'Wifite Pro', category: 'Wireless', command: 'wifite --kill', description: 'One-click WiFi auditing & cracking', icon: Wifi },
    { id: 'bettercap', name: 'Bettercap', category: 'Wireless', command: 'bettercap -iface wlan0', description: 'Advanced network monitoring & MitM', icon: Zap },
    { id: 'aircrack', name: 'Aircrack-ng', category: 'Wireless', command: 'airmon-ng start wlan0', description: 'WPA/WPA2 cracking suite', icon: Shield },
    { id: 'nmap', name: 'Network Scanner', category: 'Wireless', command: 'nmap -sn 192.168.1.0/24', description: 'Detect alive devices on local network', icon: Network },
    { id: 'hcxdumptool', name: 'HCX Packet Tool', category: 'Wireless', command: 'hcxdumptool -i wlan0', description: 'WPA/WPA2 capture tool for PMKID', icon: Activity },
    
    { id: 'msf', name: 'Metasploit Core', category: 'Exploitation', command: 'msfconsole -q', description: 'Direct access to MSF exploits', icon: Shield },
    { id: 'sqlmap', name: 'SQL Injector', category: 'Exploitation', command: 'sqlmap --wizard', description: 'Automated SQL injection testing', icon: Database },
    { id: 'hydra', name: 'Brute Force', category: 'Exploitation', command: 'hydra -L users.txt -P pass.txt', description: 'Rapid login credential testing', icon: Lock },
    { id: 'john', name: 'John the Ripper', category: 'Exploitation', command: 'john --test', description: 'Password cracking & auditing', icon: Lock },
    { id: 'socialfish', name: 'SocialFish', category: 'Exploitation', command: 'socialfish', description: 'Phishing tool for credentials', icon: Bot },

    { id: 'ettercap', name: 'MitM Engine', category: 'Sniffing', command: 'ettercap -G', description: 'ARP poisoning & data interception', icon: Zap },
    { id: 'wireshark', name: 'TShark', category: 'Sniffing', command: 'tshark -i wlan0', description: 'CLI version of Wireshark', icon: Activity },
    { id: 'ghost', name: 'Identity Ghost', category: 'Sniffing', command: 'spoof --random', description: 'Spoof MAC & IMEI for total stealth', icon: Bot },
    { id: 'sniff', name: 'Packet Sniffer', category: 'Sniffing', command: 'tcpdump -i any', description: 'Direct packet capture from bridge', icon: Database },
    { id: 'mitmproxy', name: 'MitmProxy', category: 'Sniffing', command: 'mitmproxy', description: 'Interactive SSL/TLS intercept proxy', icon: Lock },

    { id: 'dump', name: 'Memory Dump', category: 'Forensics', command: 'mem-dump -a', description: 'Extract volatile memory for analysis', icon: HardDrive },
    { id: 'autopsy', name: 'Autopsy CLI', category: 'Forensics', command: 'autopsy -h', description: 'Digital forensics & incident response', icon: Search },
    { id: 'volatility', name: 'Volatility', category: 'Forensics', command: 'vol --list-modules', description: 'Advanced memory forensics framework', icon: Shield },
    { id: 'chroot', name: 'Chroot Scanner', category: 'Forensics', command: 'chroot-scan /', description: 'Verify chroot integrity', icon: Network },

    { id: 'set', name: 'S.E.T.', category: 'Social', command: 'setoolkit', description: 'Social Engineering Toolkit', icon: Smartphone },
    { id: 'beef', name: 'BeEF Hook', category: 'Social', command: 'beef-xss', description: 'Browser Exploitation Framework', icon: Zap },
    { id: 'fluxion', name: 'Fluxion', category: 'Social', command: 'fluxion', description: 'WiFi Social Engineering attack', icon: Wifi },

    { id: 'nikto', name: 'Nikto Scanner', category: 'Web', command: 'nikto -h google.com', description: 'Web server vulnerability scanner', icon: Network },
    { id: 'recon', name: 'Recon-ng', category: 'Web', command: 'recon-ng', description: 'Web reconnaissance framework', icon: Search },
    { id: 'dirb', name: 'DIRB Scanner', category: 'Web', command: 'dirb http://target.com', description: 'Web content scanner', icon: Database }
  ];

  const categories: ('Wireless' | 'Exploitation' | 'Sniffing' | 'Forensics' | 'Social' | 'Web')[] = ['Wireless', 'Exploitation', 'Sniffing', 'Forensics', 'Social', 'Web'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 p-10 overflow-y-auto scrollbar-hide"
    >
      <div className="max-w-6xl mx-auto space-y-12 relative">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-singularity-danger/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-singularity-accent/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
           <h1 className="text-[10px] uppercase tracking-[0.5em] font-black text-singularity-danger">Security Command Hub</h1>
           <p className="text-5xl font-bold tracking-tighter text-white uppercase italic">Nethunter_OneClick_V3</p>
           <p className="text-white/40 max-w-2xl text-xs uppercase tracking-widest font-mono">
             Optimized for Android 16 Debian Terminal Bridge. No Root required. Commands execute via encrypted User-Space Tunnels.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {categories.map(cat => (
             <div key={cat} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                   <div className="w-1.5 h-1.5 bg-singularity-danger rounded-full" />
                   <span className="text-[9px] uppercase font-black tracking-widest opacity-40">{cat}</span>
                </div>
                <div className="space-y-3">
                   {tools.filter(t => t.category === cat).map(tool => (
                     <button 
                       key={tool.id}
                       onClick={() => onExecute(tool)}
                       className="w-full bg-white/[0.02] border border-white/5 p-5 text-left group hover:border-singularity-danger/50 hover:bg-singularity-danger/[0.03] transition-all relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 group-hover:scale-110 group-hover:opacity-20 transition-all">
                           <tool.icon size={40} />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-singularity-danger transition-colors">{tool.name}</h4>
                        <p className="text-[10px] opacity-40 leading-tight mb-4">{tool.description}</p>
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-mono text-white/20">{tool.command}</span>
                           <Zap size={12} className="text-singularity-danger opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>

        <div className="bg-black/40 border border-singularity-danger/20 p-6 flex items-center justify-between backdrop-blur-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-singularity-danger/40 flex items-center justify-center rounded-none relative">
                 <div className="absolute inset-0 bg-singularity-danger/10 animate-pulse" />
                 <Shield size={20} className="text-singularity-danger" />
              </div>
              <div>
                 <div className="text-[10px] font-black uppercase text-white tracking-widest">Global Security Audit</div>
                 <div className="text-[9px] opacity-40 uppercase tracking-widest font-mono">Status: Awaiting Trigger...</div>
              </div>
           </div>
           <button 
             onClick={() => onExecute({ id: 'audit', name: 'FULL CORE AUDIT', category: 'Wireless', command: 'singular-audit --all', description: '', icon: Shield })}
             className="px-8 py-3 bg-singularity-danger text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
           >
              Execute Audit
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const LomiriShell: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-[#300a24] z-[100] flex"
    >
      {/* Lomiri Sidebar */}
      <div className="w-16 bg-black/40 h-full flex flex-col items-center py-6 gap-6 border-r border-white/5 backdrop-blur-md">
        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center p-2">
           <div className="w-full h-full border-2 border-white rounded-full bg-transparent" />
        </div>
        <div className="flex-1 flex flex-col gap-4 opacity-60">
           <Wifi size={18} />
           <Battery size={18} />
           <Activity size={18} />
           <HardDrive size={18} />
        </div>
        <button onClick={onExit} className="p-3 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>
      
      {/* Main OS View */}
      <div className="flex-1 p-12 flex flex-col gap-10">
        <div className="flex justify-between items-start">
           <div className="space-y-1">
             <h1 className="text-4xl font-light text-white tracking-tight">Ubuntu Touch</h1>
             <p className="text-orange-400 font-mono text-[10px] uppercase tracking-widest">Environment_Active // Rootless_Mode</p>
           </div>
           <div className="text-right text-white/40 font-mono text-sm uppercase">
             {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {['Messages', 'Settings', 'Camera', 'Browser', 'Terminal', 'Store'].map(app => (
             <div key={app} className="aspect-square bg-white shadow-xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-orange-50 transition-colors">
               <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  {app === 'Terminal' ? <TerminalIcon size={24} /> : <Zap size={24} />}
               </div>
               <span className="text-black text-[10px] font-bold uppercase tracking-widest">{app}</span>
             </div>
           ))}
        </div>

        <div className="mt-auto bg-black/20 p-6 backdrop-blur-md border border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-3 h-3 bg-singularity-success rounded-full animate-pulse" />
             <span className="text-[10px] text-white/60 font-mono italic underline">Pixel_10_Pro_Hardware_Bridge: ACTIVE</span>
           </div>
           <div className="flex gap-4 opacity-40 text-[10px] font-bold">
             <span>CPU: 12%</span>
             <span>RAM: 4.2GB</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const KaliShell: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#0c0c0c] z-[100] font-mono text-singularity-success p-12 flex flex-col gap-8"
    >
      <div className="flex justify-between items-center border-b border-singularity-success/20 pb-6">
        <div className="flex items-center gap-4">
           <Shield className="text-singularity-danger animate-pulse" />
           <h2 className="text-xl font-bold tracking-tighter">KALI_NETHUNTER_PROOT</h2>
        </div>
        <button onClick={onExit} className="text-singularity-success/40 hover:text-singularity-success text-[10px] uppercase underline">Return_to_singularity</button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-black border border-singularity-success/10 p-6 flex flex-col gap-4 overflow-y-auto scrollbar-hide text-[12px]">
           <div className="text-singularity-success opacity-40 italic mt-auto">--- ROOTLESS_BYPASS_INITIATED ---</div>
           <div className="text-singularity-accent">[SYSTEM] Detecting Pixel 10 Pro Sensors...</div>
           <div className="text-singularity-success font-bold underline">[OK] GPS_MAPPED // BLUETOOTH_HOOKED // WIFI_MONITOR_ON</div>
           <div className="space-y-1">
             <p className="text-white">&gt; wifite -i wlan0mon --crack</p>
             <p className="opacity-60">[+] SCANNING_TARGETS...</p>
             <p className="opacity-60">[+] CAPTURING_HANDSHAKES...</p>
             <p className="text-singularity-danger font-bold animate-pulse">[!!!] VULNERABLE_ACCESS_POINT_DETECTED: Guest_Network_4G</p>
           </div>
           <div className="flex gap-2 items-center">
             <span className="animate-pulse">_</span>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-singularity-danger/5 border border-singularity-danger/20 p-4 border-l-4">
             <div className="text-[10px] font-bold text-singularity-danger mb-2">THREAT_VECTOR_MONITOR</div>
             <div className="text-sm">ARP_POISON_ACTIVE</div>
           </div>
           <div className="flex-1 bg-black/40 border border-white/5 p-6 flex flex-col gap-4">
              <div className="text-[9px] uppercase tracking-widest opacity-40">Mapped Tools</div>
              {['Metasploit', 'Nmap', 'SQLMap', 'Ettercap', 'Aircrack-ng'].map(tool => (
                <div key={tool} className="py-2 border-b border-white/5 flex justify-between items-center">
                  <span className="text-xs">{tool}</span>
                  <div className="w-2 h-2 bg-singularity-success rounded-full" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const OSManager: React.FC<{ activeOS: string, onSelect: (id: string) => void, setIsShellActive: (v: boolean) => void, addLog: (m: string, t?: any) => void }> = ({ activeOS, onSelect, setIsShellActive, addLog }) => {
  const osList: OSInstance[] = [
    { id: 'android', name: 'Android 16 (Host)', kernel: 'v6.12-GKI', status: activeOS === 'android' ? 'active' : 'suspended', icon: Smartphone, hwMapping: ['Display', 'Touch', 'Audio', 'GPU'] },
    { id: 'ubuntu', name: 'Ubuntu Touch', kernel: 'v5.15-LOMIRI', status: activeOS === 'ubuntu' ? 'active' : 'offline', icon: Activity, hwMapping: ['GPS', 'Camera', 'Sensor_Hub', 'LTE'] },
    { id: 'debian', name: 'Debian Mobile', kernel: 'v6.6-PHOSH', status: activeOS === 'debian' ? 'active' : 'offline', icon: Layers, hwMapping: ['BT_Stack', 'GPU_DRM', 'Vibrator'] },
    { id: 'nethunter', name: 'Kali NetHunter', kernel: 'v6.1-SECURITY', status: activeOS === 'nethunter' ? 'active' : 'offline', icon: Shield, hwMapping: ['WLAN_MON', 'HID_KEYS', 'USB_OTG'] },
    { id: 'arch', name: 'Arch Linux ARM', kernel: 'v6.11-ROLLING', status: activeOS === 'arch' ? 'active' : 'offline', icon: Cpu, hwMapping: ['PCIe', 'IO_BUS', 'SEC_ENCLAVE'] },
    { id: 'fedora', name: 'Fedora Mobility', kernel: 'v6.10-RAW', status: activeOS === 'fedora' ? 'active' : 'offline', icon: Database, hwMapping: ['X11_HOOK', 'WIREPLUMBER', 'MESA'] }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-10 space-y-12 overflow-y-auto scrollbar-hide"
    >
       <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-8">
          <div>
            <h1 className="text-[10px] uppercase tracking-[0.5em] font-bold text-singularity-accent mb-2">Environment Hub</h1>
            <p className="text-4xl font-bold tracking-tighter text-white uppercase italic">Zero_Root_MultiOS_Bridge</p>
          </div>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => (window as any).setActiveView('flasher')}
              className="px-6 py-2 border border-singularity-danger text-singularity-danger text-[9px] font-black uppercase tracking-widest hover:bg-singularity-danger hover:text-white transition-all flex items-center gap-2"
            >
              <AlertCircle size={12} />
              Full ROM Install
            </button>
            <div className="text-right border-l border-white/10 pl-6">
              <div className="text-[9px] opacity-30 uppercase tracking-widest font-bold mb-1">Pixel 10 Pro Tunnel</div>
              <div className="text-xl font-mono text-singularity-success underline underline-offset-4">HARDWARE_BYPASS_ON</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {osList.map(os => (
            <div 
              key={os.id}
              onClick={() => onSelect(os.id)}
              className={`p-10 border transition-all cursor-pointer group relative overflow-hidden ${
                os.status === 'active' 
                  ? 'bg-white/[0.05] border-singularity-accent shadow-[0_0_50px_rgba(59,130,246,0.15)]' 
                  : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all">
                <os.icon size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-2 h-2 rounded-full ${os.status === 'active' ? 'bg-singularity-success animate-pulse' : 'bg-white/20'}`} />
                  <div className="text-[9px] uppercase tracking-[0.3em] font-black opacity-30">{os.id}_ENV_INSTANCE</div>
                </div>
                
                <h3 className="text-4xl font-bold tracking-tighter text-white mb-2">{os.name}</h3>
                <p className="text-xs font-mono opacity-40 mb-10">{os.kernel}</p>
                
                <div className="space-y-4">
                   <div className="text-[9px] uppercase font-bold tracking-widest opacity-20">Direct Hardware Access:</div>
                   <div className="flex flex-wrap gap-2">
                      {os.hwMapping.map(hw => (
                        <span key={hw} className="text-[8px] px-2 py-1 bg-white/5 border border-white/5 text-singularity-accent font-bold rounded-sm">
                           {hw}
                        </span>
                      ))}
                   </div>
                </div>

                <div className="mt-10 flex items-center justify-between">
                   <span className={`text-[10px] uppercase font-black tracking-widest ${os.status === 'active' ? 'text-singularity-success' : 'text-white/20'}`}>
                    {os.status}
                   </span>
                   {os.status === 'active' && (
                     <button 
                       onClick={() => {
                         addLog(`Switching to ${os.name} UI...`, "warning");
                         setTimeout(() => setIsShellActive(true), 1200);
                       }}
                       className="text-[9px] uppercase font-bold tracking-widest border border-singularity-accent px-4 py-2 bg-singularity-accent/10 hover:bg-singularity-accent hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                     >
                       Enter Environment
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-singularity-accent/5 border border-singularity-accent/20 p-8 flex items-start gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Smartphone size={100} />
          </div>
          <Zap className="text-singularity-accent shrink-0" size={32} />
          <div className="relative z-10">
            <div className="text-xl font-bold text-white mb-2 italic tracking-tighter">Universal Hardware Bridge v1.0.4 r2</div>
            <p className="text-sm opacity-60 leading-relaxed max-w-2xl">
              Using a proprietary <span className="text-singularity-accent underline decoration-dotted font-bold">Zero-Root Tunnel</span>, Singularity maps Pixel 10 Pro hardware features directly to virtualized guest operating systems. This allows Ubuntu Touch to access raw Camera data, GPS coordinates, and LTE bands without ever modifying the host Android recovery or bootloader partitions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SystemSuggestions: React.FC<{ metrics: SystemMetric[] }> = ({ metrics }) => {
  const [suggestions, setSuggestions] = useState<{ id: string, title: string, type: 'warning' | 'info' | 'success', description: string, actionLabel: string }[]>([]);

  useEffect(() => {
    const newSuggestions: any[] = [];
    const cpu = metrics.find(m => m.id === 'cpu_load')?.value || 0;
    const mem = metrics.find(m => m.id === 'ram_usage')?.value || 0;
    const net = metrics.find(m => m.id === 'net_flux')?.value || 0;

    if (cpu > 80) {
      newSuggestions.push({
        id: 'cpu-heat',
        title: 'CPU Thermal Alert',
        type: 'warning',
        description: 'Kernel clocking throttled to prevent overheating. Consider suspending background OS.',
        actionLabel: 'Throttle Down'
      });
    }

    if (mem > 90) {
      newSuggestions.push({
        id: 'ram-low',
        title: 'Memory Exhaustion',
        type: 'warning',
        description: 'VRAM buffer is near capacity. Swap partition is becoming active.',
        actionLabel: 'Purge Cache'
      });
    }

    if (net > 2000) {
      newSuggestions.push({
        id: 'net-peak',
        title: 'Network Saturation',
        type: 'info',
        description: 'Massive bandwidth detected in tunnel. Check for active packet sniffing.',
        actionLabel: 'Inspect Tunnel'
      });
    }

    if (newSuggestions.length === 0) {
       newSuggestions.push({
         id: 'opt-ready',
         title: 'System Optimal',
         type: 'success',
         description: 'All bridges stable. Android 16 Debian relay is running at 450Hz.',
         actionLabel: 'Full Report'
       });
    }

    setSuggestions(newSuggestions);
  }, [metrics]);

  return (
    <div className="space-y-6">
       <h3 className="text-[10px] uppercase tracking-[0.4em] text-singularity-accent font-bold mb-4">Neural Suggestions</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map(s => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 border flex flex-col justify-between ${
                s.type === 'warning' ? 'bg-singularity-danger/5 border-singularity-danger/20' :
                s.type === 'info' ? 'bg-singularity-accent/5 border-singularity-accent/20' :
                'bg-singularity-success/5 border-singularity-success/20'
              }`}
            >
               <div className="space-y-2">
                  <div className={`text-[10px] uppercase font-black ${
                    s.type === 'warning' ? 'text-singularity-danger' :
                    s.type === 'info' ? 'text-singularity-accent' :
                    'text-singularity-success'
                  }`}>{s.title}</div>
                  <p className="text-[11px] text-white/60 leading-relaxed font-mono">{s.description}</p>
               </div>
               <button className="mt-6 text-[9px] uppercase font-black tracking-widest text-white/40 hover:text-white transition-colors text-left flex items-center gap-2">
                  {s.actionLabel}
                  <Zap size={10} />
               </button>
            </motion.div>
          ))}
       </div>
    </div>
  );
};

const FlashROMView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'idle' | 'warning' | 'flashing' | 'restarting'>('idle');
  const [progress, setProgress] = useState(0);

  const startFlash = () => {
    setStage('warning');
  };

  const confirmFlash = () => {
    setStage('flashing');
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStage('restarting');
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }, 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-10 flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-2xl"
    >
      <div className="max-w-2xl space-y-10">
        {stage === 'idle' && (
          <>
            <div className="w-24 h-24 border-2 border-singularity-danger mx-auto flex items-center justify-center text-singularity-danger animate-pulse">
               <AlertCircle size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tighter text-white uppercase italic">Full_OS_Replacement</h2>
              <p className="text-xs text-white/40 font-mono leading-relaxed">
                This operation will wipe your current Android 16 Host partition and replace it with a pre-configured Singularity ROM. This includes integrated root access, full Debian bridge, and kernel-level security tools.
              </p>
            </div>
            <button 
              onClick={startFlash}
              className="px-12 py-5 border-2 border-singularity-danger text-singularity-danger text-[12px] font-black uppercase tracking-[0.5em] hover:bg-singularity-danger hover:text-white transition-all"
            >
              Initialize Flash
            </button>
          </>
        )}

        {stage === 'warning' && (
          <div className="bg-singularity-danger/10 border border-singularity-danger p-10 space-y-8">
            <h3 className="text-2xl font-black text-singularity-danger uppercase">Critical Warning</h3>
            <p className="text-xs text-white/80 font-mono">
              DATA LOSS IS IMMINENT. BOOTLOADER UNLOCK REQUIRED. IF YOU DO NOT KNOW WHAT YOU ARE DOING, DISCONNECT NOW.
            </p>
            <div className="flex gap-4 justify-center">
               <button onClick={() => setStage('idle')} className="px-8 py-3 bg-white/5 text-white/40 uppercase text-[10px] font-bold">Cancel</button>
               <button onClick={confirmFlash} className="px-8 py-3 bg-singularity-danger text-white uppercase text-[10px] font-black">I UNDERSTAND - ERASE & FLASH</button>
            </div>
          </div>
        )}

        {stage === 'flashing' && (
          <div className="space-y-12">
            <div className="text-[10px] font-black text-singularity-accent uppercase tracking-[1em] animate-pulse">Flashing_Singularity_V5.zip</div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-singularity-accent" 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
               />
            </div>
            <div className="grid grid-cols-2 gap-8 font-mono text-[9px] opacity-40 text-left">
               <div>ERASING /SYSTEM...</div>
               <div>REPLACING /BOOT...</div>
               <div>MAPPING HARDWARE...</div>
               <div>{progress}% COMPLETE</div>
            </div>
          </div>
        )}

        {stage === 'restarting' && (
          <div className="space-y-6 animate-pulse">
            <h2 className="text-2xl font-bold text-white uppercase tracking-[0.5em]">Restarting System</h2>
            <p className="text-[10px] opacity-40 font-mono">Singularity_OS // V5.1_GKI // KERNEL_LOADED</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SettingsSection: React.FC<{ title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 last:border-0 pb-8 pt-8 first:pt-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group py-2"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded bg-singularity-accent/10 text-singularity-accent group-hover:scale-110 transition-transform`}>
            <Icon size={18} />
          </div>
          <h3 className="text-[12px] uppercase tracking-[0.3em] font-black text-white/80 group-hover:text-singularity-accent transition-colors">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          className="text-white/20"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 pl-12">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsView: React.FC<{ prefs: UserPreferences, setPrefs: React.Dispatch<React.SetStateAction<UserPreferences>> }> = ({ prefs, setPrefs }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-10 overflow-y-auto scrollbar-hide"
    >
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        <div className="border-b border-white/10 pb-8 mb-12">
           <h1 className="text-[10px] uppercase tracking-[0.5em] font-black text-singularity-accent mb-2">System Preferences</h1>
           <p className="text-4xl font-bold tracking-tighter text-white uppercase italic">Advanced_Kernel_Config</p>
        </div>

        <div className="space-y-4">
          {/* Visual Architecture */}
          <SettingsSection title="Visual Architecture" icon={Zap}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['dark', 'amoled', 'brutalist', 'hacker'].map((t) => (
                <button
                  key={t}
                  onClick={() => setPrefs(p => ({ ...p, theme: t as any }))}
                  className={`p-6 border text-left transition-all group relative overflow-hidden ${
                    prefs.theme === t 
                      ? 'bg-singularity-accent/10 border-singularity-accent text-white' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  <div className="text-[11px] uppercase font-black tracking-widest mb-2">{t}</div>
                  <div className="text-[9px] opacity-40 font-mono italic leading-tight">
                    {t === 'dark' && 'Standard High-Contrast Interface'}
                    {t === 'amoled' && 'Deep Space Pure Black'}
                    {t === 'brutalist' && 'Raw Architectural Grid'}
                    {t === 'hacker' && 'Matrix Protocol Override'}
                  </div>
                  {prefs.theme === t && (
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-2 h-2 bg-singularity-accent rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* Default Interpreter */}
          <SettingsSection title="Interpreter Pipeline" icon={TerminalIcon}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['bash', 'zsh', 'fish', 'sh'].map((s) => (
                <button
                  key={s}
                  onClick={() => setPrefs(p => ({ ...p, defaultShell: s as any }))}
                  className={`p-6 border text-left transition-all relative overflow-hidden ${
                    prefs.defaultShell === s 
                      ? 'bg-singularity-accent/10 border-singularity-accent text-white' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  <div className="text-[11px] uppercase font-black tracking-widest mb-2">{s}</div>
                  <div className="text-[9px] opacity-40 font-mono italic leading-tight">
                    {s === 'bash' && '/bin/bash_v5.2 Core'}
                    {s === 'zsh' && 'Enhanced Interactive ZSH'}
                    {s === 'fish' && 'Automated Smart Shell'}
                    {s === 'sh' && 'POSIX Standard Bourne'}
                  </div>
                  {prefs.defaultShell === s && (
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-2 h-2 bg-singularity-accent rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* Interruption Masking */}
          <SettingsSection title="System Isolation" icon={Shield}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setPrefs(p => ({ ...p, notifications: !p.notifications }))}
                className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 group hover:border-white/10 cursor-pointer transition-all"
              >
                <div className="space-y-1">
                  <div className="text-[11px] uppercase font-black tracking-widest text-white/80">System Notifications</div>
                  <div className="text-[9px] font-mono text-white/30 uppercase">Neural Feedback Relay</div>
                </div>
                <div className={`w-12 h-6 rounded-none relative transition-colors border ${prefs.notifications ? 'bg-singularity-accent border-singularity-accent' : 'bg-transparent border-white/20'}`}>
                  <motion.div 
                    animate={{ x: prefs.notifications ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white" 
                  />
                </div>
              </div>

              <ModuleToggle 
                label="AI Healer Daemon"
                active={prefs.autoHeal}
                description="Kernel Self-Repair Loop"
                onToggle={() => setPrefs(p => ({ ...p, autoHeal: !p.autoHeal }))}
              />
            </div>
          </SettingsSection>

          {/* Resource Optimization */}
          <SettingsSection title="Resource Management" icon={Activity}>
            <div className="space-y-12 max-w-2xl">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black tracking-widest text-white/80">Tunnel Compression Efficiency</label>
                    <div className="text-[9px] font-mono text-white/30 uppercase">Bandwidth/Latency Tradeoff</div>
                  </div>
                  <div className="text-xl font-mono text-singularity-accent tracking-tighter">
                    {prefs.tunnelEfficiency}<span className="text-[10px] opacity-40 ml-1">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={prefs.tunnelEfficiency}
                  onChange={(e) => setPrefs(p => ({ ...p, tunnelEfficiency: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/5 rounded-none appearance-none cursor-pointer accent-singularity-accent"
                />
                <div className="flex justify-between text-[8px] font-mono opacity-20 uppercase tracking-widest">
                   <span>Raw_Unfiltered</span>
                   <span>Deep_Compression</span>
                </div>
              </div>

              <div className={`space-y-6 transition-all duration-500 ${!prefs.autoHeal ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-black tracking-widest text-white/80">Healer Daemon Sensitivity</label>
                    <div className="text-[9px] font-mono text-white/30 uppercase">Response Priority Threshold</div>
                  </div>
                  <div className="text-xl font-mono text-singularity-success tracking-tighter">
                    {prefs.healerSensitivity}<span className="text-[10px] opacity-40 ml-1">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={prefs.healerSensitivity}
                  onChange={(e) => setPrefs(p => ({ ...p, healerSensitivity: parseInt(e.target.value) }))}
                  disabled={!prefs.autoHeal}
                  className="w-full h-1 bg-white/5 rounded-none appearance-none cursor-pointer accent-singularity-success"
                />
                <div className="flex justify-between text-[8px] font-mono opacity-20 uppercase tracking-widest">
                   <span>Passive_Log</span>
                   <span>Instant_Correction</span>
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>

        <div className="p-8 border border-white/5 mt-12 bg-white/[0.01]">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-black text-white/20 italic">
            <AlertCircle size={14} className="text-singularity-accent animate-pulse" />
            Synchronized_Session: All modifications are persisted to secure storage.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AIChatView: React.FC<{ activeOS: string, prefs: UserPreferences }> = ({ activeOS, prefs }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Initializing with system message
    setMessages([{
      role: 'system',
      content: "SINGULARITY_AI v1.0 ONLINE. I am your advanced kernel assistant. How can I optimize your Android 16 experience today?",
      timestamp: new Date().toLocaleTimeString('en-GB')
    }]);

    if (!aiRef.current) {
      const key = process.env.GEMINI_API_KEY;
      if (key) {
        aiRef.current = new GoogleGenAI({ apiKey: key });
      }
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-GB')
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simple Help Bot Logic vs Gemini
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('help') || lowerInput.includes('how to')) {
      // Local Help Bot Response (Fast)
      setTimeout(() => {
        const helpResponse: ChatMessage = {
          role: 'assistant',
          content: "I recommend checking the 'Environment Hub' for multi-OS virtualization or the 'Nethunter Hub' for security auditing. Type any specific command like 'wifite' to learn more.",
          timestamp: new Date().toLocaleTimeString('en-GB')
        };
        setMessages(prev => [...prev, helpResponse]);
        setIsTyping(false);
      }, 1000);
    } else if (aiRef.current) {
      // Advanced Gemini Bot Response
      try {
        const response = await aiRef.current.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            systemInstruction: `You are the advanced AI assistant built into Singularity OS, a rootless Android 16 virtualization and security platform. 
            Current System Context:
            - Device: Pixel 10 Pro
            - OS Interface: ${activeOS}
            - Default Shell: ${prefs.defaultShell}
            - Theme: ${prefs.theme}
            - Hardware Bridge: ACTIVE
            - Debian Bridge: ACTIVE
            - Tunnel Efficiency: ${prefs.tunnelEfficiency}%
            
            You are technical, futuristic, and helpful. You speak as a high-level system architect. Keep responses concise.`,
          }
        });

        const geminiResponse: ChatMessage = {
          role: 'gemini',
          content: response.text || "Connection to neural core lost. Please retry.",
          timestamp: new Date().toLocaleTimeString('en-GB')
        };
        setMessages(prev => [...prev, geminiResponse]);
      } catch (error) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: "ERROR: NEURAL_BRIDGE_DISRUPTED. Ensure API key is configured.",
          timestamp: new Date().toLocaleTimeString('en-GB')
        }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Fallback
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Gemini core is offline. I am operating in basic help mode. Try 'help' for system guides.",
          timestamp: new Date().toLocaleTimeString('en-GB')
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full bg-black/20"
    >
      <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-3 mb-2 opacity-30">
                <span className="text-[8px] uppercase tracking-widest font-black">
                  {msg.role === 'user' ? 'Operator' : msg.role === 'gemini' ? 'Gemini_Core' : 'Help_Bot'}
                </span>
                <span className="text-[8px] font-mono">{msg.timestamp}</span>
              </div>
              <div className={`p-6 max-w-[80%] border ${
                msg.role === 'user' 
                  ? 'bg-singularity-accent/10 border-singularity-accent text-white' 
                  : msg.role === 'gemini'
                    ? 'bg-singularity-danger/5 border-singularity-danger/30 text-singularity-text'
                    : 'bg-white/[0.03] border-white/10 text-white/80'
              }`}>
                <p className="text-xs leading-relaxed font-mono">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 opacity-50 ml-2">
              <div className="w-1.5 h-1.5 bg-singularity-accent animate-bounce" />
              <div className="w-1.5 h-1.5 bg-singularity-accent animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-singularity-accent animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>
      </div>

      <div className="p-8 border-t border-white/5 backdrop-blur-xl">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-4 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
             <Bot size={18} />
          </div>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about kernels, security, or virtualization..."
            className="flex-1 bg-white/[0.03] border border-white/10 p-4 pl-12 text-xs text-white placeholder-white/10 outline-none focus:border-singularity-accent transition-all rounded-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-8 py-4 bg-singularity-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-20 disabled:grayscale"
          >
            Transmit
          </button>
        </form>
      </div>
    </motion.div>
  );
};
const SystemMonitor: React.FC<{ history: HistoricalData[] }> = ({ history }) => {
  return (
    <div className="space-y-8 bg-white/[0.01] border border-white/5 p-10 backdrop-blur-3xl rounded-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BarChart3 size={20} className="text-singularity-accent" />
          <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-white">Quantum Telemetry Stack</h2>
        </div>
        <div className="text-[10px] font-mono text-singularity-muted uppercase tracking-[0.2em]">Live Stream // 450Hz</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* CPU & MEMORY AREA CHART */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Core Load & VRAM Matrix</span>
            <span className="text-[10px] font-mono text-singularity-accent">SYSCALL_HOOK_STABLE</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis hide dataKey="time" />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', borderRadius: '4px' }}
                  itemStyle={{ color: '#ededed' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="memory" stroke="#9333ea" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NETWORK & DISK I/O */}
        <div className="space-y-4">
           <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">IOPS & Satellite Flux</span>
            <span className="text-[10px] font-mono text-singularity-success">PACKET_FLOW_PEAK</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis hide dataKey="time" />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', borderRadius: '4px' }}
                  itemStyle={{ color: '#ededed' }}
                />
                <Area type="monotone" dataKey="network" stroke="#10b981" fillOpacity={1} fill="url(#colorNet)" strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="disk" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDisk)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-white/5">
        {[
          { label: 'CPU Cluster', val: history[history.length-1]?.cpu.toFixed(0), unit: '%', color: 'text-singularity-accent' },
          { label: 'Hyper VRAM', val: (history[history.length-1]?.memory / 10).toFixed(1), unit: 'GB', color: 'text-singularity-secondary' },
          { label: 'I/O Load', val: history[history.length-1]?.disk.toFixed(0), unit: 'IOPS', color: 'text-yellow-500' },
          { label: 'NTN Relay', val: history[history.length-1]?.network.toFixed(0), unit: 'Mbps', color: 'text-singularity-success' }
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="text-[9px] uppercase tracking-widest font-bold opacity-30">{stat.label}</div>
            <div className={`text-2xl font-light tracking-tighter ${stat.color}`}>{stat.val}{stat.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProcessTreeItem: React.FC<{ node: ProcessNode, depth: number }> = ({ node, depth }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="font-mono">
      <div 
        className={`flex items-center gap-4 py-2 px-4 hover:bg-white/5 cursor-pointer border-l border-white/5 transition-colors group`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `${depth * 24 + 16}px` }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {hasChildren ? (
            <motion.span 
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="text-singularity-accent"
            >
              <Zap size={10} fill="currentColor" />
            </motion.span>
          ) : (
            <div className="w-2.5 h-2.5 border border-white/20 rounded-full" />
          )}
          <span className="text-white/80 truncate">{node.name}</span>
        </div>
        
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="w-16">PID: {node.pid}</div>
          <div className="w-16">PPID: {node.ppid}</div>
          <div className="w-24 text-right">
            <span className={node.cpu > 20 ? 'text-singularity-danger' : 'text-singularity-success'}>
              {node.cpu.toFixed(1)}% CPU
            </span>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children!.map(child => (
              <ProcessTreeItem key={child.pid} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProcessView: React.FC<{ processes: ProcessNode[] }> = ({ processes }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-10 overflow-y-auto scrollbar-hide"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-8">
          <div>
            <h1 className="text-[10px] uppercase tracking-[0.5em] font-bold text-singularity-accent mb-2">Process Explorer</h1>
            <p className="text-4xl font-bold tracking-tighter text-white uppercase italic">Active_Kernel_Threads</p>
          </div>
          <div className="text-right">
            <div className="text-[9px] opacity-30 uppercase tracking-widest font-bold mb-1">Total Threads</div>
            <div className="text-3xl font-light tracking-tighter text-white">124</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
          <div className="flex items-center gap-4 py-4 px-8 bg-white/5 border-b border-white/5 text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">
            <span className="flex-1">Process Tree</span>
            <div className="flex gap-8">
              <span className="w-16">PID</span>
              <span className="w-16">PPID</span>
              <span className="w-24 text-right">Usage</span>
            </div>
          </div>
          <div className="py-4">
            {processes.map(proc => (
              <ProcessTreeItem key={proc.pid} node={proc} depth={0} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'process' | 'os-manager' | 'nethunter' | 'settings' | 'ai-chat' | 'flasher'>('dashboard');
  const [activeOS, setActiveOS] = useState('android');
  const [isShellActive, setIsShellActive] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  
  // User Preferences State
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('singularity_prefs');
    return saved ? JSON.parse(saved) : {
      defaultShell: 'zsh',
      theme: 'dark',
      notifications: true,
      autoHeal: true,
      healerSensitivity: 75,
      tunnelEfficiency: 85
    };
  });

  useEffect(() => {
    (window as any).setActiveView = setActiveView;
    localStorage.setItem('singularity_prefs', JSON.stringify(prefs));
    
    // Sync healer module with prefs
    setModules(prev => prev.map(m => 
      m.id === 'healer' ? { ...m, active: prefs.autoHeal } : m
    ));
  }, [prefs, setActiveView]);

  // Persistence Keys
  const STORAGE_KEYS = {
    LOGS: 'singularity_logs_v5',
    METRICS_HISTORY: 'singularity_metrics_v5',
    CMD_HISTORY: 'singularity_cmd_history_v5'
  };

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoricalData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.METRICS_HISTORY);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 20 }, (_, i) => ({
      time: i.toString(),
      cpu: 20 + Math.random() * 30,
      memory: 40 + Math.random() * 20,
      network: 10 + Math.random() * 50,
      disk: 5 + Math.random() * 15
    }));
  });

  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CMD_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [processes, setProcesses] = useState<ProcessNode[]>([
    {
      pid: 1, ppid: 0, name: 'systemd', cpu: 0.1, children: [
        { pid: 482, ppid: 1, name: 'k-core-daemon', cpu: 4.2, children: [
          { pid: 1024, ppid: 482, name: 'quantum-vram-engine', cpu: 12.4 },
          { pid: 1025, ppid: 482, name: 'healer-v2', cpu: 1.1 }
        ]},
        { pid: 512, ppid: 1, name: 'nethunter-svc', cpu: 8.5, children: [
          { pid: 2048, ppid: 512, name: 'wifite-scanner', cpu: 15.2 },
          { pid: 2049, ppid: 512, name: 'msf-handler', cpu: 2.4 }
        ]},
        { pid: 600, ppid: 1, name: 'proot-hypervisor', cpu: 2.1 }
      ]
    },
    { pid: 2, ppid: 0, name: 'kthreadd', cpu: 0.0 }
  ]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'Core Load', value: 34, unit: '%', trend: 'stable' },
    { label: 'VRAM', value: 2.1, unit: 'GB', trend: 'up' },
    { label: 'Neural Link', value: 124, unit: 'ms', trend: 'down' },
    { label: 'Healing Efficiency', value: 98, unit: '%', trend: 'stable' },
  ]);

  const [modules, setModules] = useState([
    { id: 'vram', label: 'Quantum VRAM Expand', description: 'Enable 16GB ZRAM Logic', active: true },
    { id: 'nethunter', label: 'Nethunter V3 One-Click', description: 'Kali Linux Toolset v26.4 (A16 Optimized)', active: true },
    { id: 'user-mode', label: 'Debian Terminal Bridge', description: 'Android 16 Built-in Rootless Bypass', active: true },
    { id: 'stealth', label: 'Identity Ghost', description: 'Pixel 10 Pro Hardware Masking', active: false },
    { id: 'satellite', label: 'Satellite NTN Link', description: 'Aggressive Space Connectivity', active: true },
    { id: 'healer', label: 'AI Healer Daemon', description: 'Kernel Self-Repair Loop', active: true },
  ]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const next = [...prev.slice(-99), {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-GB'),
        type,
        message
      }];
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METRICS_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CMD_HISTORY, JSON.stringify(commandHistory));
  }, [commandHistory]);

  useEffect(() => {
    if (!isBooting) {
      addLog("Singularity OS Kernel v4.2.0 initialized.", "success");
      addLog("System integrity check: 100%", "success");
      addLog("Quantum VRAM module loaded successfully.");
    }
  }, [isBooting]);

  useEffect(() => {
    if (!isBooting) {
      const interval = setInterval(() => {
        setMetrics(prev => prev.map(m => ({
          ...m,
          value: Math.max(0, m.value + (Math.random() - 0.5) * (m.label === 'VRAM' ? 0.1 : 2)).toFixed(m.label === 'VRAM' ? 1 : 0) as any,
          trend: Math.random() > 0.5 ? 'up' : 'down'
        })));

        if (Math.random() > 0.7) {
          const systemLogs = [
            "Optimizer: Flushing dirty cache pages...",
            "Healer: Rectified segmentation fault in memory block 0x3F2",
            "Network: NTN Handshake latency within targets",
            "Kernel: Dynamic governor adjusted for peak throughput",
            "AI: LLM-driven prediction for I/O optimized",
          ];
          addLog(systemLogs[Math.floor(Math.random() * systemLogs.length)], "system");
        }

        setHistory(prev => {
          const newData: HistoricalData = {
            time: new Date().toISOString(),
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 100,
            disk: Math.random() * 100,
          };
          return [...prev.slice(1), newData];
        });

        setProcesses(prev => {
          const updateNodes = (nodes: ProcessNode[]): ProcessNode[] => {
            return nodes.map(node => ({
              ...node,
              cpu: Math.max(0, node.cpu + (Math.random() - 0.5) * 2),
              children: node.children ? updateNodes(node.children) : undefined
            }));
          };
          return updateNodes(prev);
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isBooting]);

  const [command, setCommand] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    addLog(`> ${command}`, 'info');
    const cmd = command.toLowerCase().trim();
    
    // Add to command history if not empty and not same as last
    if (command.trim() && commandHistory[0] !== command.trim()) {
      setCommandHistory(prev => [command.trim(), ...prev.slice(0, 49)]);
    }
    setHistoryIndex(-1);
    
    if (cmd === 'help') {
      addLog("Available: help, clear, status, reboot, bypass, nmap, wifite, msfconsole, ettercap, launch <os>, shell, kali", "system");
    } else if (cmd === 'shell' || cmd === 'enter') {
      addLog(`Entering active shell: ${activeOS.toUpperCase()}...`, "warning");
      setTimeout(() => setIsShellActive(true), 1000);
    } else if (cmd === 'kali' || cmd === 'nethunter') {
      setActiveView('nethunter');
      addLog("Accessing Nethunter Command Hub...", "warning");
    } else if (cmd.startsWith('launch')) {
      const os = cmd.split(' ')[1];
      if (['ubuntu', 'debian', 'android', 'nethunter'].includes(os)) {
        addLog(`Switching environment to ${os.toUpperCase()}...`, "warning");
        addLog(`Initializing virtual bootloader for ${os}...`, "info");
        setTimeout(() => {
          setActiveOS(os);
          setActiveView('os-manager');
          addLog(`${os.toUpperCase()} environment active.`, "success");
        }, 1000);
      } else {
        addLog("Usage: launch [ubuntu|debian|android]", "error");
      }
    } else if (cmd === 'bypass') {
      addLog("Initializing Zero-Day User-Space Escape...", "warning");
      addLog("Tracing syscalls... HOOKED", "success");
      addLog("Environment: ROOT_PRIVILEGES_EMULATED", "success");
    } else if (cmd === 'nmap') {
      addLog("Nmap: Scanning 127.0.0.1 via User-Land Virtual Stack...");
      addLog("Nmap: Port 80 Open (Vite Dev Server)", "success");
      addLog("Nmap: Port 3000 Open (Singularity Reverse Proxy)", "success");
    } else if (cmd === 'wifite') {
      addLog("Wifite: Initializing monitor mode on wlan0...", "warning");
      addLog("Wifite: Found 12 Targets. Scanning handshaking data...", "info");
      addLog("Wifite: CRACKED [Home_WiFi_2.4G] KEY: **********", "success");
    } else if (cmd === 'msfconsole') {
      addLog("Metasploit: Starting framework...", "system");
      addLog("Metasploit: Loaded 2394 exploits, 1238 auxiliary modules.", "info");
      addLog("Metasploit: Handler listening on 0.0.0.0:4444", "success");
    } else if (cmd === 'ettercap') {
      addLog("Ettercap: Unified Sniffing started.");
      addLog("Ettercap: ARP poisoning internal virtual bridge...", "warning");
      addLog("Ettercap: Intercepting user traffic... [VIRTUAL_DATA_LEAK]", "error");
    } else if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'reboot') {
      setIsBooting(true);
    } else if (cmd === 'heal') {
      addLog("Healer: Manual scan initiated...");
      addLog("Healer: Found 0 anomalies. Kernel is peak.", "success");
    } else if (cmd === 'fastbootd') {
      addLog("[SUPER-ROM] Hot-swapping to FastbootD...", "warning");
      setTimeout(() => setIsBooting(true), 1500);
    } else {
      addLog(`Command not found: ${command}`, "error");
    }
    setCommand('');
  };

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === id) {
        const newState = !m.active;
        addLog(`${m.label} ${newState ? 'ENABLED' : 'DISABLED'}`, newState ? 'success' : 'warning');
        if (id === 'vram') {
           setMetrics(metrics => metrics.map(met => met.label === 'VRAM' ? {...met, value: newState ? 12.4 : 2.1} : met));
        }
        if (id === 'healer') {
          setPrefs(p => ({ ...p, autoHeal: newState }));
        }
        return { ...m, active: newState };
      }
      return m;
    }));
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-700 overflow-hidden selection:bg-singularity-accent/30 selection:text-white font-sans ${
      prefs.theme === 'amoled' ? 'bg-black' : 
      prefs.theme === 'hacker' ? 'bg-black text-[#00ff00]' : 
      prefs.theme === 'brutalist' ? 'bg-[#f0f0f0] text-black' : 'bg-singularity-bg text-singularity-text'
    }`}>
      <AnimatePresence>
        {isBooting && <BootOverlay onComplete={() => setIsBooting(false)} />}
        {isShellActive && activeOS === 'ubuntu' && <LomiriShell onExit={() => setIsShellActive(false)} />}
        {isShellActive && activeOS === 'nethunter' && <KaliShell onExit={() => setIsShellActive(false)} />}
      </AnimatePresence>

      <div className="scanline" />
      
      {/* BACKGROUND DECO */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] artistic-blur-1 opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] artistic-blur-2 opacity-20" />
        <div className="absolute top-24 left-10 text-[180px] font-bold leading-[0.8] tracking-tighter text-white/5 select-none font-sans uppercase">
          SINGULAR<br/>
          <span className="text-stroke opacity-10">CORE</span>
        </div>
        <div className="absolute bottom-0 right-0 p-10 opacity-5">
           <div className="text-[120px] font-bold tracking-tighter leading-none text-right font-sans uppercase">
            VIVO<br/>OS_4.2
          </div>
        </div>
      </div>

      {!isBooting && (
        <div className="h-screen flex flex-col relative z-20 overflow-hidden">
          
          {/* HEADER / NAV */}
          <nav className="h-16 flex items-center justify-between px-10 border-b border-white/5 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm rotate-45" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Singularity</span>
              </div>
              <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-black text-white/30 px-12 border-l border-white/5 h-full items-center">
                <span 
                  onClick={() => setActiveView('dashboard')}
                  className={`hover:text-singularity-accent cursor-pointer transition-colors relative ${activeView === 'dashboard' ? 'text-white' : ''}`}
                >
                  Core Explorer
                  {activeView === 'dashboard' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-singularity-accent" />}
                </span>
                <span 
                   onClick={() => setActiveView('nethunter')}
                   className={`hover:text-singularity-danger cursor-pointer transition-colors relative ${activeView === 'nethunter' ? 'text-white' : ''}`}
                >
                  Nethunter Hub
                  {activeView === 'nethunter' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-singularity-danger" />}
                </span>
                <span 
                  onClick={() => setActiveView('process')}
                  className={`hover:text-white cursor-pointer transition-colors relative ${activeView === 'process' ? 'text-white' : ''}`}
                >
                  Thread Matrix
                  {activeView === 'process' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-white" />}
                </span>
                <span 
                   onClick={() => setActiveView('os-manager')}
                   className={`hover:text-singularity-success cursor-pointer transition-colors relative ${activeView === 'os-manager' ? 'text-white' : ''}`}
                >
                  Environment
                  {activeView === 'os-manager' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-singularity-success" />}
                </span>
                <span 
                   onClick={() => setActiveView('flasher')}
                   className={`hover:text-singularity-danger cursor-pointer transition-colors relative ${activeView === 'flasher' ? 'text-white' : ''}`}
                >
                  System Burner
                  {activeView === 'flasher' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-singularity-danger" />}
                </span>
                <span 
                   onClick={() => setActiveView('ai-chat')}
                   className={`hover:text-singularity-accent cursor-pointer transition-colors relative ${activeView === 'ai-chat' ? 'text-white' : ''}`}
                >
                  Singularity AI
                  {activeView === 'ai-chat' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-singularity-accent" />}
                </span>
                <span 
                  onClick={() => setActiveView('settings')}
                  className={`hover:text-white cursor-pointer transition-colors relative ${activeView === 'settings' ? 'text-white' : ''}`}
                >
                  Settings
                   {activeView === 'settings' && <motion.div layoutId="nav" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-white" />}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5">
                <Wifi size={12} className="text-singularity-accent" />
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80">SYS_STABLE // NTN_LINK</span>
              </div>
              <div className="text-[11px] font-mono tracking-widest opacity-40 uppercase">
                {new Date().toLocaleTimeString('en-GB')}
              </div>
            </div>
          </nav>

          <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {activeView === 'dashboard' ? (
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                {/* LEFT SIDE: HERO CONTENT & CONTROLS */}
                <div className="md:col-span-8 flex flex-col p-10 pt-20 gap-20 overflow-y-auto scrollbar-hide">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-6xl font-bold tracking-tighter text-white uppercase group cursor-default">
                        Optimized<br/>
                        <span className="opacity-20 group-hover:opacity-100 transition-all duration-500">Kernel_5.0_A16</span>
                      </h2>
                      <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-singularity-accent hover:text-white transition-colors cursor-pointer">Reboot System</div>
                        <div className="px-4 py-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:border-white transition-colors cursor-pointer" onClick={() => setActiveView('process')}>Thread Matrix</div>
                        <div className="px-4 py-2 bg-singularity-danger text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.2)]" onClick={() => setActiveView('nethunter')}>Launch Nethunter</div>
                      </div>
                    </div>
                  </div>

                  {/* MONITORING SECTION */}
                  <SystemMonitor history={history} />

                  <div className="grid grid-cols-1 gap-x-12 gap-y-16">
                    <SystemSuggestions metrics={metrics} />

                    <div className="space-y-8">
                       <div className="flex items-center gap-3">
                         <Shield size={18} className="text-singularity-accent" />
                         <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Impossible Modules</h3>
                       </div>
                       <div className="space-y-1 border-t border-white/5">
                         {modules.map(module => (
                             <ModuleToggle 
                               key={module.id}
                               label={module.label}
                               description={module.description}
                               active={module.active}
                               onToggle={() => toggleModule(module.id)}
                             />
                           ))}
                       </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: METRICS & CONSOLE */}
                <div className="md:col-span-4 border-l border-white/5 bg-black/20 backdrop-blur-sm flex flex-col min-h-0">
                  <div className="p-8 space-y-12">
                      <header>
                        <h3 className="text-[10px] uppercase tracking-[0.4em] text-singularity-accent font-bold mb-8">Resource Allocation</h3>
                        <div className="space-y-10">
                          <MetricCard metric={metrics[0]} icon={Cpu} />
                          <MetricCard metric={metrics[1]} icon={Database} />
                        </div>
                      </header>
                  </div>
                  <div className="flex-1 min-h-0 p-8 pt-0">
                    <Console 
                        logs={logs} 
                        command={command}
                        setCommand={setCommand}
                        onCommand={handleCommand}
                        history={commandHistory}
                        historyIndex={historyIndex}
                        setHistoryIndex={setHistoryIndex}
                      />
                  </div>
                </div>
              </div>
            ) : activeView === 'process' ? (
              <ProcessView processes={processes} />
            ) : activeView === 'nethunter' ? (
              <NethunterHub onExecute={(tool) => {
                 addLog(`Executing: ${tool.name}...`, 'warning');
                 addLog(`Command [${tool.command}] running via A16 Debian Bridge.`, 'info');
              }} />
            ) : activeView === 'os-manager' ? (
              <OSManager activeOS={activeOS} onSelect={setActiveOS} setIsShellActive={setIsShellActive} addLog={addLog} />
            ) : activeView === 'settings' ? (
              <SettingsView prefs={prefs} setPrefs={setPrefs} />
            ) : activeView === 'flasher' ? (
              <FlashROMView onComplete={() => setActiveView('dashboard')} />
            ) : (
              <AIChatView activeOS={activeOS} prefs={prefs} />
            )}
          </main>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Theme Overrides */
        ${prefs.theme === 'hacker' ? `
          :root {
            --color-singularity-accent: #00ff00 !important;
            --color-singularity-danger: #008000 !important;
            --color-singularity-success: #00ff00 !important;
          }
          * { border-color: rgba(0, 255, 0, 0.1) !important; }
          .text-white { color: #00ff00 !important; }
          .opacity-40 { opacity: 0.8 !important; }
        ` : ''}

        ${prefs.theme === 'brutalist' ? `
           :root {
             --color-singularity-accent: #000000 !important;
             --color-singularity-bg: #f0f0f0 !important;
           }
           * { border-radius: 0 !important; border-width: 2px !important; border-color: #000 !important; }
           .text-white { color: #000 !important; }
        ` : ''}
      `}</style>
    </div>
  );
}
