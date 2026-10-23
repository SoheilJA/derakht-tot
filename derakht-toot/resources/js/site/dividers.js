import gsap from 'gsap';
import { qsa, reduced } from '../lib/utils';

const DIVIDER_SVG =
    '<svg viewBox="0 0 1200 90" class="w-full h-14 md:h-20" fill="none" aria-hidden="true">' +
    '<path class="dv-branch" d="M0,46 C160,26 300,66 480,44 S800,62 940,38 S1140,50 1200,42" stroke="#7A5636" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path class="dv-leaf" d="M300,44 q-14,-18 -8,-38 q14,18 8,38" fill="#3E8E41"/>' +
    '<path class="dv-leaf" d="M480,44 q16,-16 12,-38 q-16,16 -12,38" fill="#8BC17A"/>' +
    '<path class="dv-leaf" d="M700,50 q-14,-20 -6,-40 q14,20 6,40" fill="#1F4D2B"/>' +
    '<path class="dv-leaf" d="M940,38 q16,-14 14,-36 q-16,14 -14,36" fill="#3E8E41"/>' +
    '<circle class="dv-leaf" cx="596" cy="36" r="5" fill="#8E2C63"/>' +
    '<circle class="dv-leaf" cx="824" cy="52" r="5" fill="#5A1A3F"/>' +
    '</svg>';

export function initDividers() {
    const RM = reduced();

    qsa('[data-divider]').forEach((d) => {
        d.innerHTML = DIVIDER_SVG;

        const branch = d.querySelector('.dv-branch');
        const length = branch.getTotalLength();
        branch.style.strokeDasharray = length;
        branch.style.strokeDashoffset = RM ? 0 : length;

        if (RM) return;

        gsap.to(branch, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: d, start: 'top 92%' },
        });

        gsap.fromTo(
            d.querySelectorAll('.dv-leaf'),
            { scale: 0, transformOrigin: 'center' },
            {
                scale: 1,
                duration: 0.55,
                stagger: 0.1,
                ease: 'back.out(2.5)',
                scrollTrigger: { trigger: d, start: 'top 92%' },
            }
        );
    });
}