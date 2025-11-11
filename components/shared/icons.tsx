import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  BotMessageSquare,
  Boxes,
  Braces,
  Bug,
  Calendar,
  Camera,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Clock,
  CloudUpload,
  Code,
  Cog,
  Copy,
  Crown,
  DatabaseZap,
  Download,
  EllipsisVertical,
  Eraser,
  Eye,
  File,
  FileText,
  GlobeLock,
  Hand,
  Heading1,
  HelpCircle,
  Home,
  Image,
  Inbox,
  Info,
  Laptop,
  Layers,
  LayoutGrid,
  LayoutPanelLeft,
  Link,
  List,
  ListChecks,
  ListFilter,
  Loader2,
  LockKeyhole,
  LockKeyholeOpen,
  LucideIcon,
  LucideProps,
  Mail,
  MailOpen,
  MailPlus,
  MessageSquareQuote,
  MessagesSquare,
  MonitorDown,
  Moon,
  MoreVertical,
  Package,
  Paintbrush,
  Plus,
  Puzzle,
  QrCode,
  RefreshCw,
  ScanQrCode,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SunMedium,
  Trash2,
  Type,
  Unlink,
  Unplug,
  User,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import LogoIcon from "./logo";

export type Icon = LucideIcon;

export const Icons = {
  add: Plus,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  bookOpen: BookOpen,
  braces: Braces,
  check: Check,
  checkCheck: CheckCheck,
  close: X,
  code: Code,
  copy: Copy,
  clock: Clock,
  cog: Cog,
  type: Type,
  camera: Camera,
  calendar: Calendar,
  crown: Crown,
  eraser: Eraser,
  puzzle: Puzzle,
  hand: Hand,
  scanQrCode: ScanQrCode,
  monitorDown: MonitorDown,
  shieldCheck: ShieldCheck,
  layers: Layers,
  databaseZap: DatabaseZap,
  boxes: Boxes,
  shieldUser: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M6.376 18.91a6 6 0 0 1 11.249.003" />
      <circle cx="12" cy="11" r="4" />
    </svg>
  ),
  cloudUpload: ({ ...props }: LucideProps) => (
    <svg
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g clipPath="url(#upload_svg__clip0)">
        <path
          fill="currentColor"
          d="M14.966 7.211a2.91 2.91 0 00-2-.68 4.822 4.822 0 00-9.243-1.147A3.41 3.41 0 001.3 6.18 3.65 3.65 0 000 8.938a3.562 3.562 0 003.554 3.555H6.5v-1H3.547A2.559 2.559 0 011 8.938a2.64 2.64 0 01.943-1.992 2.413 2.413 0 012.032-.527l.435.075.13-.422a3.821 3.821 0 017.47 1.016l.017.57.563-.091a2.071 2.071 0 011.729.404A2.029 2.029 0 0115 9.508a1.987 1.987 0 01-1.985 1.985h-.032c-.061.001-.428.006-2.483.006v1c1.93 0 2.392-.004 2.515-.007a3.01 3.01 0 001.951-5.282v.001z"
        ></path>
        <path
          fill="currentColor"
          d="M10.95 9.456l-2.46-2.5-2.46 2.5.712.701L7.99 8.89v3.62h1v-3.62l1.248 1.268.713-.701z"
        ></path>
      </g>
      <defs>
        <clipPath id="upload_svg__clip0">
          <path d="M0 0h16v16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  ),
  storage: ({ ...props }: LucideProps) => (
    <svg
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.116 2.57c-.973-.326-2.384-.546-3.991-.546-1.607 0-3.018.22-3.99.545-.492.164-.814.337-.992.478a.89.89 0 00-.082.072c.02.069.078.158.225.268.21.158.548.313 1.025.448.947.266 2.292.409 3.814.409 1.522 0 2.867-.143 3.814-.41.477-.134.816-.29 1.025-.447.147-.11.204-.2.225-.268a.884.884 0 00-.082-.072c-.178-.141-.5-.314-.991-.478zM4.02 4.818a5.18 5.18 0 01-.97-.369v1.757c0 .079.039.206.25.377.214.173.556.347 1.03.5.944.306 2.284.49 3.795.49 1.51 0 2.85-.184 3.794-.49.474-.153.817-.327 1.03-.5.212-.171.251-.298.251-.377V4.45a5.18 5.18 0 01-.97.369c-1.08.304-2.534.45-4.105.45-1.571 0-3.026-.146-4.105-.45zm10.23 1.388V3.05C14.25 1.917 11.508 1 8.125 1S2 1.917 2 3.049V12.95C2 14.083 4.742 15 8.125 15s6.125-.917 6.125-2.049V6.207zM13.2 7.654c-.28.157-.602.29-.95.403-1.083.35-2.543.54-4.125.54-1.582 0-3.042-.19-4.125-.54a5.258 5.258 0 01-.95-.403v1.712c0 .078.039.205.25.376.214.173.556.348 1.03.501.944.306 2.284.489 3.795.489 1.51 0 2.85-.183 3.794-.489.474-.153.817-.328 1.03-.5.212-.172.251-.299.251-.377V7.654zM4 11.215a5.253 5.253 0 01-.95-.403v2.058c.018.019.047.046.093.083.178.141.5.314.992.478.972.325 2.383.545 3.99.545 1.607 0 3.018-.22 3.99-.545.492-.164.814-.337.992-.478a.809.809 0 00.093-.083v-2.058a5.25 5.25 0 01-.95.403c-1.083.351-2.543.541-4.125.541-1.582 0-3.042-.19-4.125-.54zm9.224 1.624s0 .002-.004.006a.028.028 0 01.004-.006zm-10.198 0l.004.006a.024.024 0 01-.004-.006zm1.599-6.29c.29 0 .525-.23.525-.512a.519.519 0 00-.525-.513c-.29 0-.525.23-.525.513 0 .282.235.512.525.512zM5.15 9.28a.519.519 0 01-.525.513.519.519 0 01-.525-.513c0-.282.235-.512.525-.512.29 0 .525.23.525.512zm-.525 3.671c.29 0 .525-.23.525-.512a.519.519 0 00-.525-.512c-.29 0-.525.23-.525.512 0 .283.235.512.525.512z"
      ></path>
    </svg>
  ),
  eye: Eye,
  lock: LockKeyhole,
  list: List,
  layoutGrid: LayoutGrid,
  unLock: LockKeyholeOpen,
  listFilter: ListFilter,
  botMessageSquare: BotMessageSquare,
  moreVertical: EllipsisVertical,
  pwdKey: ({ ...props }: LucideProps) => (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="currentColor">
        <path
          d="M7.75,13.25H3.75c-1.105,0-2-.895-2-2V6.75c0-1.105,.895-2,2-2H14.25c1.105,0,2,.895,2,2v.25"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <path
          d="M12.25,12.25v-2c0-.828,.672-1.5,1.5-1.5h0c.828,0,1.5,.672,1.5,1.5v2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <circle
          cx="5.5"
          cy="9"
          fill="currentColor"
          r="1"
          stroke="none"
        ></circle>
        <circle cx="9" cy="9" fill="currentColor" r="1" stroke="none"></circle>
        <rect
          height="4"
          width="6"
          fill="none"
          rx="1"
          ry="1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x="10.75"
          y="12.25"
        ></rect>
      </g>
    </svg>
  ),
  fileText: FileText,
  dashboard: LayoutPanelLeft,
  download: Download,
  ellipsis: MoreVertical,
  paintbrush: Paintbrush,
  mousePointerClick: ({ className, ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`group cursor-pointer transition-transform duration-75 hover:scale-110 ${className || ""}`}
      {...props}
    >
      {/* 点击波纹线条 - 默认显示 */}
      <g className="group-hover:hidden">
        <path d="M14 4.1 12 6" />
        <path d="m5.1 8-2.9-.8" />
        <path d="m6 12-1.9 2" />
        <path d="M7.2 2.2 8 5.1" />
      </g>

      {/* 点击波纹线条 - 动画版本 */}
      <g className="opacity-0 group-hover:opacity-100">
        <path
          d="M14 4.1 12 6"
          className="transition-all duration-500 group-hover:animate-ping"
          style={{
            animationDelay: "0.1s",
            transformOrigin: "13px 5px",
          }}
        />
        <path
          d="m5.1 8-2.9-.8"
          className="transition-all duration-500 group-hover:animate-ping"
          style={{
            animationDelay: "0.2s",
            transformOrigin: "4px 7.6px",
          }}
        />
        <path
          d="m6 12-1.9 2"
          className="transition-all duration-500 group-hover:animate-ping"
          style={{
            animationDelay: "0.3s",
            transformOrigin: "5px 13px",
          }}
        />
        <path
          d="M7.2 2.2 8 5.1"
          className="transition-all duration-500 group-hover:animate-ping"
          style={{
            animationDelay: "0.4s",
            transformOrigin: "7.6px 3.6px",
          }}
        />
      </g>

      {/* 鼠标指针 - 带点击缩放效果 */}
      <path
        d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
        className="transition-transform duration-200 group-hover:scale-90 group-hover:animate-pulse"
        style={{
          transformOrigin: "15px 15px",
        }}
      />
    </svg>
  ),
  listChecks: ListChecks,
  github: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        fill="currentColor"
      />
    </svg>
  ),
  help: HelpCircle,
  home: Home,
  heading1: Heading1,
  qrcode: QrCode,
  laptop: Laptop,
  logo: LogoIcon,
  media: Image,
  messages: MessagesSquare,
  messageQuoted: MessageSquareQuote,
  moon: Moon,
  page: File,
  package: Package,
  post: FileText,
  refreshCw: RefreshCw,
  search: Search,
  settings: Settings,
  userSettings: UserCog,
  spinner: Loader2,
  sun: SunMedium,
  trash: Trash2,
  inbox: Inbox,
  info: Info,
  twitter: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="twitter"
      role="img"
      {...props}
    >
      <path
        d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0"
        fill="currentColor"
      />
    </svg>
  ),
  user: User,
  users: Users,
  warning: AlertTriangle,
  globeLock: GlobeLock,
  globe: ({ className, ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "group inline-block cursor-pointer transition-transform duration-200 group-hover:scale-110",
        className,
      )}
      style={{ animationDuration: "2s" }}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path
        className="group-hover:hidden"
        d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      />
      <path
        d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
        className="transition-all duration-300 ease-in-out [stroke-dasharray:60] [stroke-dashoffset:-60] group-hover:[stroke-dashoffset:0]"
      />
      <path className="group-hover:hidden" d="M2 12h20" />
      <path
        d="M2 12h20"
        className="duration-800 transition-all ease-in-out [stroke-dasharray:20] [stroke-dashoffset:-20] group-hover:[stroke-dashoffset:0]"
        style={{ transitionDelay: "0.2s" }}
      />
    </svg>
  ),
  link: Link,
  unLink: Unlink,
  mail: Mail,
  mailPlus: MailPlus,
  mailOpen: MailOpen,
  bug: Bug,
  CirclePlay: CirclePlay,
  unplug: Unplug,
  send: Send,
  lineChart: ({ className, ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "group inline-block cursor-pointer transition-transform duration-75 group-hover:scale-110",
        className,
      )}
      {...props}
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path
        className="group-hover:hidden"
        d="m19 9-5 5-4-4-3 3"
        stroke="#0065ea"
      />
      <path
        d="m19 9-5 5-4-4-3 3"
        stroke="#0065ea"
        className="transition-all duration-1000 ease-in-out [stroke-dasharray:20] [stroke-dashoffset:-20] group-hover:[stroke-dashoffset:0]"
      />
    </svg>
  ),
  outLink: ({ ...props }: LucideProps) => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M20 13.5001C20 14.8946 20 15.5919 19.8618 16.1673C19.4229 17.9956 17.9955 19.423 16.1672 19.8619C15.5918 20.0001 14.8945 20.0001 13.5 20.0001H12C9.19974 20.0001 7.79961 20.0001 6.73005 19.4551C5.78924 18.9758 5.02433 18.2109 4.54497 17.2701C4 16.2005 4 14.8004 4 12.0001V11.5001C4 9.17035 4 8.0055 4.3806 7.08664C4.88807 5.8615 5.86144 4.88813 7.08658 4.38066C7.86344 4.05888 8.81614 4.00915 10.5 4.00146M19.7597 9.45455C20.0221 7.8217 20.0697 6.16984 19.9019 4.54138C19.8898 4.42328 19.838 4.31854 19.7597 4.24027M19.7597 4.24027C19.6815 4.16201 19.5767 4.11023 19.4586 4.09806C17.8302 3.93025 16.1783 3.97792 14.5455 4.24027M19.7597 4.24027L10 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
  discord: ({ ...props }: LucideProps) => (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1396 1070"
      width="1396"
      height="1070"
      {...props}
    >
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
          <path d="m0 0h5586.5v1069.8h-5586.5z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp2">
          <path d="m0 0h5586.5v1069.8h-5586.5z" />
        </clipPath>
      </defs>
      <g id="layer1">
        <g id="g866">
          <g id="Clip-Path: g835" clipPath="url(#cp1)">
            <g id="g835">
              <g id="Clip-Path: g833" clipPath="url(#cp2)">
                <g id="g833">
                  <path
                    id="path815"
                    fillRule="evenodd"
                    fill="#5865f2"
                    d="m1389.7 890.5c-120.8 89.5-238.1 143.8-353.3 179.3-28.6-38.7-53.8-80-75.7-123.3 41.6-15.7 81.6-35 119.4-57.6-9.9-7.3-19.7-14.9-29.2-22.8-226.9 106.3-476.5 106.3-706.1 0-9.4 7.9-19.2 15.5-29.2 22.8 37.7 22.5 77.5 41.8 119.1 57.4-21.8 43.5-47.2 84.6-75.6 123.4-115.2-35.5-232.3-89.8-353.2-179.2-24.7-262.1 24.7-528 207-800.7 90.3-41.9 187-72.5 288.1-89.8 12.5 22.2 27.3 52.1 37.3 75.8q158.1-24 319.1 0c10-23.7 24.5-53.6 36.9-75.8 101 17.3 197.6 47.7 288 89.6 157.9 233.6 236.4 497 207.4 800.9zm-798.2-302.6c0-78.2-56.1-141.4-125.5-141.4-69.4 0-125.5 63.2-125.5 141.4 0 78.2 56.1 141.4 125.5 141.4 69.4 0 125.5-63.2 125.5-141.4zm463.7 0c0-78.2-56.1-141.4-125.5-141.4-69.4 0-125.5 63.2-125.5 141.4 0 78.2 56.1 141.4 125.5 141.4 69.4 0 125.5-63.2 125.5-141.4z"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  ),
  cloudflare: ({ ...props }: LucideProps) => (
    <svg
      width="800px"
      height="800px"
      viewBox="0 -70 256 256"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <g>
        <g transform="translate(0.000000, -1.000000)">
          <path
            d="M202.3569,50.394 L197.0459,48.27 C172.0849,104.434 72.7859,70.289 66.8109,86.997 C65.8149,98.283 121.0379,89.143 160.5169,91.056 C172.5559,91.639 178.5929,100.727 173.4809,115.54 L183.5499,115.571 C195.1649,79.362 232.2329,97.841 233.7819,85.891 C231.2369,78.034 191.1809,85.891 202.3569,50.394 Z"
            fill="#FFFFFF"
          ></path>
          <path
            d="M176.332,109.3483 C177.925,104.0373 177.394,98.7263 174.739,95.5393 C172.083,92.3523 168.365,90.2283 163.585,89.6973 L71.17,88.6343 C70.639,88.6343 70.108,88.1033 69.577,88.1033 C69.046,87.5723 69.046,87.0413 69.577,86.5103 C70.108,85.4483 70.639,84.9163 71.701,84.9163 L164.647,83.8543 C175.801,83.3233 187.486,74.2943 191.734,63.6723 L197.046,49.8633 C197.046,49.3313 197.577,48.8003 197.046,48.2693 C191.203,21.1823 166.772,0.9993 138.091,0.9993 C111.535,0.9993 88.697,17.9953 80.73,41.8963 C75.419,38.1783 69.046,36.0533 61.61,36.5853 C48.863,37.6473 38.772,48.2693 37.178,61.0163 C36.647,64.2033 37.178,67.3903 37.71,70.5763 C16.996,71.1073 0,88.1033 0,109.3483 C0,111.4723 0,113.0663 0.531,115.1903 C0.531,116.2533 1.593,116.7843 2.125,116.7843 L172.614,116.7843 C173.676,116.7843 174.739,116.2533 174.739,115.1903 L176.332,109.3483 Z"
            fill="#F4811F"
          ></path>
          <path
            d="M205.5436,49.8628 L202.8876,49.8628 C202.3566,49.8628 201.8256,50.3938 201.2946,50.9248 L197.5766,63.6718 C195.9836,68.9828 196.5146,74.2948 199.1706,77.4808 C201.8256,80.6678 205.5436,82.7918 210.3236,83.3238 L229.9756,84.3858 C230.5066,84.3858 231.0376,84.9168 231.5686,84.9168 C232.0996,85.4478 232.0996,85.9788 231.5686,86.5098 C231.0376,87.5728 230.5066,88.1038 229.4436,88.1038 L209.2616,89.1658 C198.1076,89.6968 186.4236,98.7258 182.1746,109.3478 L181.1116,114.1288 C180.5806,114.6598 181.1116,115.7218 182.1746,115.7218 L252.2826,115.7218 C253.3446,115.7218 253.8756,115.1908 253.8756,114.1288 C254.9376,109.8798 255.9996,105.0998 255.9996,100.3188 C255.9996,72.7008 233.1616,49.8628 205.5436,49.8628"
            fill="#FAAD3F"
          ></path>
        </g>
      </g>
    </svg>
  ),
  forwardArrow: ({ ...props }: LucideProps) => (
    <svg
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      // className="h-4 w-4 shrink-0 text-gray-400"
      {...props}
    >
      <g fill="currentColor">
        <path
          d="M15.25,9.75H4.75c-1.105,0-2-.895-2-2V3.75"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <polyline
          fill="none"
          points="11 5.5 15.25 9.75 11 14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></polyline>
      </g>
    </svg>
  ),
  resend: ({ ...props }: LucideProps) => (
    <svg
      fill="none"
      viewBox="0 0 78 78"
      width="80"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 28.6C3 19.6392 3 15.1587 4.7439 11.7362C6.27787 8.72556 8.72556 6.27787 11.7362 4.7439C15.1587 3 19.6392 3 28.6 3H49.4C58.3608 3 62.8413 3 66.2638 4.7439C69.2744 6.27787 71.7221 8.72556 73.2561 11.7362C75 15.1587 75 19.6392 75 28.6V49.4C75 58.3608 75 62.8413 73.2561 66.2638C71.7221 69.2744 69.2744 71.7221 66.2638 73.2561C62.8413 75 58.3608 75 49.4 75H28.6C19.6392 75 15.1587 75 11.7362 73.2561C8.72556 71.7221 6.27787 69.2744 4.7439 66.2638C3 62.8413 3 58.3608 3 49.4V28.6Z"
        fill="url(#paint0_linear_1_13)"
      ></path>
      <path
        clipRule="evenodd"
        d="M49.4 6H28.6C24.0701 6 20.8531 6.00233 18.3355 6.20802C15.853 6.41085 14.316 6.79637 13.0981 7.41692C10.652 8.66327 8.66327 10.652 7.41692 13.0981C6.79637 14.316 6.41085 15.853 6.20802 18.3355C6.00233 20.8531 6 24.0701 6 28.6V49.4C6 53.9299 6.00233 57.1469 6.20802 59.6645C6.41085 62.147 6.79637 63.684 7.41692 64.9019C8.66327 67.348 10.652 69.3367 13.0981 70.5831C14.316 71.2036 15.853 71.5891 18.3355 71.792C20.8531 71.9977 24.0701 72 28.6 72H49.4C53.9299 72 57.1469 71.9977 59.6645 71.792C62.147 71.5891 63.684 71.2036 64.9019 70.5831C67.348 69.3367 69.3367 67.348 70.5831 64.9019C71.2036 63.684 71.5891 62.147 71.792 59.6645C71.9977 57.1469 72 53.9299 72 49.4V28.6C72 24.0701 71.9977 20.8531 71.792 18.3355C71.5891 15.853 71.2036 14.316 70.5831 13.0981C69.3367 10.652 67.348 8.66327 64.9019 7.41692C63.684 6.79637 62.147 6.41085 59.6645 6.20802C57.1469 6.00233 53.9299 6 49.4 6ZM4.7439 11.7362C3 15.1587 3 19.6392 3 28.6V49.4C3 58.3608 3 62.8413 4.7439 66.2638C6.27787 69.2744 8.72556 71.7221 11.7362 73.2561C15.1587 75 19.6392 75 28.6 75H49.4C58.3608 75 62.8413 75 66.2638 73.2561C69.2744 71.7221 71.7221 69.2744 73.2561 66.2638C75 62.8413 75 58.3608 75 49.4V28.6C75 19.6392 75 15.1587 73.2561 11.7362C71.7221 8.72556 69.2744 6.27787 66.2638 4.7439C62.8413 3 58.3608 3 49.4 3H28.6C19.6392 3 15.1587 3 11.7362 4.7439C8.72556 6.27787 6.27787 8.72556 4.7439 11.7362Z"
        fill="black"
        fillRule="evenodd"
      ></path>
      <path
        d="M3 28.6C3 19.6392 3 15.1587 4.7439 11.7362C6.27787 8.72556 8.72556 6.27787 11.7362 4.7439C15.1587 3 19.6392 3 28.6 3H49.4C58.3608 3 62.8413 3 66.2638 4.7439C69.2744 6.27787 71.7221 8.72556 73.2561 11.7362C75 15.1587 75 19.6392 75 28.6V49.4C75 58.3608 75 62.8413 73.2561 66.2638C71.7221 69.2744 69.2744 71.7221 66.2638 73.2561C62.8413 75 58.3608 75 49.4 75H28.6C19.6392 75 15.1587 75 11.7362 73.2561C8.72556 71.7221 6.27787 69.2744 4.7439 66.2638C3 62.8413 3 58.3608 3 49.4V28.6Z"
        fill="url(#paint1_linear_1_13)"
      ></path>
      <path
        clipRule="evenodd"
        d="M49.532 -4.96464e-07C53.9006 -2.33846e-05 57.3626 -4.14997e-05 60.1531 0.22795C63.0066 0.461095 65.4211 0.947527 67.6258 2.07088C71.2009 3.89247 74.1075 6.7991 75.9291 10.3742C77.0525 12.5789 77.5389 14.9934 77.772 17.8469C78 20.6374 78 24.0994 78 28.4679V49.5321C78 53.9006 78 57.3626 77.772 60.1531C77.5389 63.0066 77.0525 65.4211 75.9291 67.6258C74.1075 71.2009 71.2009 74.1075 67.6258 75.9291C65.4211 77.0525 63.0066 77.5389 60.1531 77.772C57.3626 78 53.9006 78 49.5321 78H28.4679C24.0994 78 20.6374 78 17.8469 77.772C14.9934 77.5389 12.5789 77.0525 10.3742 75.9291C6.7991 74.1075 3.89247 71.2009 2.07088 67.6258C0.947527 65.4211 0.461096 63.0066 0.227951 60.1531C-4.05461e-05 57.3626 -2.2431e-05 53.9006 4.5721e-07 49.532V28.468C-2.2431e-05 24.0994 -4.05461e-05 20.6374 0.227951 17.8469C0.461096 14.9934 0.947528 12.5789 2.07088 10.3742C3.89247 6.7991 6.7991 3.89247 10.3742 2.07088C12.5789 0.947526 14.9934 0.461095 17.8469 0.22795C20.6374 -4.14997e-05 24.0994 -2.33846e-05 28.468 -4.96464e-07H49.532ZM4.7439 11.7362C3 15.1587 3 19.6392 3 28.6V49.4C3 58.3608 3 62.8413 4.7439 66.2638C6.27787 69.2744 8.72556 71.7221 11.7362 73.2561C15.1587 75 19.6392 75 28.6 75H49.4C58.3608 75 62.8413 75 66.2638 73.2561C69.2744 71.7221 71.7221 69.2744 73.2561 66.2638C75 62.8413 75 58.3608 75 49.4V28.6C75 19.6392 75 15.1587 73.2561 11.7362C71.7221 8.72556 69.2744 6.27787 66.2638 4.7439C62.8413 3 58.3608 3 49.4 3H28.6C19.6392 3 15.1587 3 11.7362 4.7439C8.72556 6.27787 6.27787 8.72556 4.7439 11.7362Z"
        fill="black"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M49.532 -4.96464e-07C53.9006 -2.33846e-05 57.3626 -4.14997e-05 60.1531 0.22795C63.0066 0.461095 65.4211 0.947527 67.6258 2.07088C71.2009 3.89247 74.1075 6.7991 75.9291 10.3742C77.0525 12.5789 77.5389 14.9934 77.772 17.8469C78 20.6374 78 24.0994 78 28.4679V49.5321C78 53.9006 78 57.3626 77.772 60.1531C77.5389 63.0066 77.0525 65.4211 75.9291 67.6258C74.1075 71.2009 71.2009 74.1075 67.6258 75.9291C65.4211 77.0525 63.0066 77.5389 60.1531 77.772C57.3626 78 53.9006 78 49.5321 78H28.4679C24.0994 78 20.6374 78 17.8469 77.772C14.9934 77.5389 12.5789 77.0525 10.3742 75.9291C6.7991 74.1075 3.89247 71.2009 2.07088 67.6258C0.947527 65.4211 0.461096 63.0066 0.227951 60.1531C-4.05461e-05 57.3626 -2.2431e-05 53.9006 4.5721e-07 49.532V28.468C-2.2431e-05 24.0994 -4.05461e-05 20.6374 0.227951 17.8469C0.461096 14.9934 0.947528 12.5789 2.07088 10.3742C3.89247 6.7991 6.7991 3.89247 10.3742 2.07088C12.5789 0.947526 14.9934 0.461095 17.8469 0.22795C20.6374 -4.14997e-05 24.0994 -2.33846e-05 28.468 -4.96464e-07H49.532ZM4.7439 11.7362C3 15.1587 3 19.6392 3 28.6V49.4C3 58.3608 3 62.8413 4.7439 66.2638C6.27787 69.2744 8.72556 71.7221 11.7362 73.2561C15.1587 75 19.6392 75 28.6 75H49.4C58.3608 75 62.8413 75 66.2638 73.2561C69.2744 71.7221 71.7221 69.2744 73.2561 66.2638C75 62.8413 75 58.3608 75 49.4V28.6C75 19.6392 75 15.1587 73.2561 11.7362C71.7221 8.72556 69.2744 6.27787 66.2638 4.7439C62.8413 3 58.3608 3 49.4 3H28.6C19.6392 3 15.1587 3 11.7362 4.7439C8.72556 6.27787 6.27787 8.72556 4.7439 11.7362Z"
        fill="url(#paint2_linear_1_13)"
        fillRule="evenodd"
      ></path>
      <path
        d="M28.3999 54.1V23.1H40.1775C42.5903 23.1 44.6146 23.5137 46.2504 24.3412C47.8964 25.1687 49.1386 26.3292 49.9769 27.8227C50.8255 29.3061 51.2497 31.0367 51.2497 33.0146C51.2497 35.0025 50.8203 36.7281 49.9616 38.1913C49.113 39.6444 47.8606 40.7696 46.2044 41.5668C44.5481 42.3539 42.5136 42.7475 40.1009 42.7475H31.7124V38.0854H39.3341C40.7449 38.0854 41.9002 37.8936 42.7999 37.5102C43.6996 37.1166 44.3641 36.5465 44.7935 35.7997C45.2331 35.0429 45.4529 34.1145 45.4529 33.0146C45.4529 31.9146 45.2331 30.9761 44.7935 30.1991C44.3539 29.412 43.6842 28.8166 42.7846 28.413C41.8849 27.9993 40.7245 27.7924 39.3034 27.7924H34.0894V54.1H28.3999ZM44.6248 40.0531L52.3999 54.1H46.051L38.414 40.0531H44.6248Z"
        fill="url(#paint3_linear_1_13)"
      ></path>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_1_13"
          x1="39"
          x2="39"
          y1="-20"
          y2="75"
        >
          <stop stopColor="#4C4C57"></stop>
          <stop offset="0.444444" stopColor="#05050A"></stop>
          <stop offset="1"></stop>
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_1_13"
          x1="39"
          x2="39"
          y1="-20"
          y2="75"
        >
          <stop stopColor="#4C4C57"></stop>
          <stop offset="0.444444" stopColor="#05050A"></stop>
          <stop offset="1"></stop>
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint2_linear_1_13"
          x1="39"
          x2="39"
          y1="3"
          y2="75"
        >
          <stop stopColor="white" stopOpacity="0.6"></stop>
          <stop offset="1" stopColor="white" stopOpacity="0.2"></stop>
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint3_linear_1_13"
          x1="29.4492"
          x2="86.4298"
          y1="25.6833"
          y2="72.588"
        >
          <stop stopColor="white"></stop>
          <stop offset="1" stopColor="white" stopOpacity="0"></stop>
        </linearGradient>
      </defs>
    </svg>
  ),
  brevo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#059669"
        d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0M7.2 4.8h5.747c2.34 0 3.895 1.406 3.895 3.516c0 1.022-.348 1.862-1.09 2.588C17.189 11.812 18 13.22 18 14.785c0 2.86-2.64 5.016-6.164 5.016H7.199v-15zm2.085 1.952v5.537h.07c.233-.432.858-.796 2.249-1.226c2.039-.659 3.037-1.52 3.037-2.655c0-.998-.766-1.656-1.924-1.656zm4.87 5.266c-.766.385-1.67.748-2.76 1.11c-1.229.387-2.11 1.386-2.11 2.407v2.315h2.365c2.387 0 4.149-1.34 4.149-3.155c0-1.067-.625-2.087-1.645-2.677z"
      />
    </svg>
  ),
  disabledLink: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 15l3 -3m2 -2l1 -1" />
      <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
      <path d="M3 3l18 18" />
      <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
    </svg>
  ),
  notFonudLink: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 7v4a1 1 0 0 0 1 1h3" />
      <path d="M7 7v10" />
      <path d="M10 8v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1z" />
      <path d="M17 7v4a1 1 0 0 0 1 1h3" />
      <path d="M21 7v10" />
    </svg>
  ),
  expiredLink: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      {...props}
    >
      <title>expire</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="invisible_box" data-name="invisible box">
          <rect width="48" height="48" fill="none" />
        </g>
        <g id="Q3_icons" data-name="Q3 icons">
          <g>
            <path d="M14.2,31.9h0a2,2,0,0,0-.9-2.9A11.8,11.8,0,0,1,6.1,16.8,12,12,0,0,1,16.9,6a12.1,12.1,0,0,1,11.2,5.6,2.3,2.3,0,0,0,2.3.9h0a2,2,0,0,0,1.1-3,15.8,15.8,0,0,0-15-7.4,16,16,0,0,0-4.8,30.6A2,2,0,0,0,14.2,31.9Z" />
            <path d="M16.5,11.5v5h-5a2,2,0,0,0,0,4h9v-9a2,2,0,0,0-4,0Z" />
            <path d="M45.7,43l-15-26a2,2,0,0,0-3.4,0l-15,26A2,2,0,0,0,14,46H44A2,2,0,0,0,45.7,43ZM29,42a2,2,0,1,1,2-2A2,2,0,0,1,29,42Zm2-8a2,2,0,0,1-4,0V26a2,2,0,0,1,4,0Z" />
          </g>
        </g>
      </g>
    </svg>
  ),
  systemErrorLink: ({ ...props }: LucideProps) => (
    <svg
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <defs></defs>
      <title>data-error</title>
      <circle cx="11" cy="8" r="1" />
      <circle cx="11" cy="16" r="1" />
      <circle cx="11" cy="24" r="1" />
      <path d="M24,3H8A2,2,0,0,0,6,5V27a2,2,0,0,0,2,2h8V27H8V21H26V5A2,2,0,0,0,24,3Zm0,16H8V13H24Zm0-8H8V5H24Z" />
      <polygon points="29.24 29.58 26.41 26.75 29.24 23.92 27.83 22.51 25 25.33 22.17 22.51 20.76 23.92 23.59 26.75 20.76 29.58 22.17 30.99 25 28.16 27.83 30.99 29.24 29.58" />
      <rect
        id="_Transparent_Rectangle_"
        data-name="&lt;Transparent Rectangle&gt;"
        className="fill-none"
        width="32"
        height="32"
      />
    </svg>
  ),
};
