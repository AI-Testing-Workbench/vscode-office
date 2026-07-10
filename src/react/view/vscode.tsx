import Icon from "@ant-design/icons/lib/components/Icon";
import { CSSProperties } from "react";
import { handler } from "../util/vscode";

export function VSCodeLogoSVG() {
    return <svg height="24" width="24" viewBox="220 280 600 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="overlap-clip">
                <path d="M 320 300 Q 240 300 240 380 L 240 600 Q 240 680 320 680 L 320 740 L 380 680 L 620 680 Q 700 680 700 600 L 700 380 Q 700 300 620 300 Z" />
            </clipPath>
            <mask id="cutout-mask">
                <rect x="0" y="0" width="1024" height="1024" fill="white" />
                <circle cx="630" cy="560" r="170" fill="black" />
                <circle cx="630" cy="560" r="140" fill="white" />
            </mask>
        </defs>
        <g id="code-window" mask="url(#cutout-mask)">
            <path d="M 320 300 Q 240 300 240 380 L 240 600 Q 240 680 320 680 L 320 740 L 380 680 L 620 680 Q 700 680 700 600 L 700 380 Q 700 300 620 300 Z"
                fill="#e8f4ff" stroke="#0080FF" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="280" y1="370" x2="660" y2="370" stroke="#D0E8FF" strokeWidth="10" strokeLinecap="round" />
            <circle cx="295" cy="335" r="11" fill="#A855F7" />
            <circle cx="333" cy="335" r="11" fill="#FB923C" />
            <circle cx="371" cy="335" r="11" fill="#22D3EE" />
            <g id="code-tag">
                <path d="M 330 420 L 295 450 L 330 480" stroke="#0080FF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="360" y1="490" x2="390" y2="410" stroke="#0080FF" strokeWidth="16" strokeLinecap="round" />
                <path d="M 410 420 L 445 450 L 410 480" stroke="#0080FF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <line x1="290" y1="535" x2="430" y2="535" stroke="#B8D4F1" strokeWidth="14" strokeLinecap="round" />
            <line x1="290" y1="570" x2="375" y2="570" stroke="#B8D4F1" strokeWidth="14" strokeLinecap="round" />
            <line x1="290" y1="605" x2="410" y2="605" stroke="#B8D4F1" strokeWidth="14" strokeLinecap="round" />
        </g>
        <g id="ai-face">
            <circle cx="630" cy="560" r="155" fill="#e8f4ff" />
            <circle cx="630" cy="560" r="155" fill="none" stroke="#0080FF" strokeWidth="20" />
            <ellipse cx="578.33" cy="525.51" rx="21.04" ry="33.83" fill="#2979ff" />
            <ellipse cx="681.67" cy="525.51" rx="21.04" ry="33.83" fill="#2979ff" />
        </g>
    </svg>
}

interface VSCodeLogoProps {
    full?: boolean;
    style?: CSSProperties;
}

export default function VSCodeLogo({ style = {}, full = true }: VSCodeLogoProps) {
    return <Icon component={VSCodeLogoSVG}
        title="Edit In VS Code" onClick={() => handler.emit('editInVSCode', full)}
        style={{ zIndex: 999999, position: 'absolute', left: 15, top: 3, ...style }}
    />
}