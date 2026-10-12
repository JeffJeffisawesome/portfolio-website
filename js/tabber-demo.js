/**
 * Tabber Interactive Guitar Chord Inspector
 * Demonstrates tabber.fyi's dynamic SVG fretboard chord engine.
 */

class TabberChordInspector {
  constructor() {
    this.activeChord = 'G';

    this.chordData = {
      'G': {
        name: 'G Major',
        frets: [3, 2, 0, 0, 0, 3],
        fingers: [2, 1, 0, 0, 0, 3],
        baseFret: 1
      },
      'C': {
        name: 'C Major',
        frets: ['x', 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1
      },
      'D': {
        name: 'D Major',
        frets: ['x', 'x', 0, 2, 3, 2],
        fingers: [0, 0, 0, 1, 3, 2],
        baseFret: 1
      },
      'Am': {
        name: 'A Minor',
        frets: ['x', 0, 2, 2, 1, 0],
        fingers: [0, 0, 2, 3, 1, 0],
        baseFret: 1
      },
      'Em7': {
        name: 'E Minor 7',
        frets: [0, 2, 2, 0, 3, 3],
        fingers: [0, 1, 2, 0, 3, 4],
        baseFret: 1
      }
    };

    this.init();
  }

  init() {
    const chordButtons = document.querySelectorAll('.mock-chord-btn');
    const lyricChords = document.querySelectorAll('.chord-badge-pill');

    chordButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const chord = btn.getAttribute('data-chord');
        if (chord) {
          this.setChord(chord);
        }
      });
    });

    lyricChords.forEach(pill => {
      pill.addEventListener('click', () => {
        const chord = pill.getAttribute('data-chord');
        if (chord) {
          this.setChord(chord);
        }
      });
    });

    this.render();
  }

  setChord(chord) {
    if (!this.chordData[chord]) return;
    this.activeChord = chord;
    this.render();
  }

  render() {
    const chordInfo = this.chordData[this.activeChord];
    if (!chordInfo) return;

    // Update active state on buttons
    document.querySelectorAll('.mock-chord-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-chord') === this.activeChord);
    });

    // Update active highlight on lyric chords
    document.querySelectorAll('.chord-badge-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-chord') === this.activeChord);
    });

    // Update title
    const titleEl = document.getElementById('tabber-fretboard-name');
    if (titleEl) {
      titleEl.textContent = chordInfo.name;
    }

    // Render SVG
    const svgEl = document.getElementById('tabber-chord-svg');
    if (!svgEl) return;

    const stringX = [14, 28, 42, 56, 70, 84];
    const fretY = [20, 38, 56, 74, 92];

    let svgHtml = `
      <rect width="98" height="96" fill="transparent" />
      <!-- Fretboard nut and frets -->
    `;

    // 6 Vertical strings
    for (let i = 0; i < 6; i++) {
      svgHtml += `<line x1="${stringX[i]}" y1="20" x2="${stringX[i]}" y2="92" stroke="var(--border-subtle)" stroke-width="1.5" />`;
    }

    // 5 Horizontal frets (nut is thicker)
    for (let f = 0; f < 5; f++) {
      const isNut = f === 0 && chordInfo.baseFret === 1;
      const strokeColor = isNut ? 'var(--carolina-blue-light)' : 'var(--border-subtle)';
      const strokeWidth = isNut ? '3' : '1';
      svgHtml += `<line x1="14" y1="${fretY[f]}" x2="84" y2="${fretY[f]}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
    }

    // Muted / Open / Fretted markers
    for (let i = 0; i < 6; i++) {
      const fret = chordInfo.frets[i];
      const finger = chordInfo.fingers[i];
      const x = stringX[i];

      if (fret === 'x') {
        svgHtml += `<text x="${x}" y="13" fill="var(--text-muted)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">×</text>`;
      } else if (fret === 0) {
        svgHtml += `<circle cx="${x}" cy="11" r="3" fill="none" stroke="var(--text-muted)" stroke-width="1.2" />`;
      } else {
        const fretOffset = fret - chordInfo.baseFret;
        if (fretOffset >= 0 && fretOffset < 4) {
          const y = fretY[fretOffset] + 9;
          svgHtml += `
            <circle cx="${x}" cy="${y}" r="5" fill="var(--accent-amber)" />
            ${finger > 0 ? `<text x="${x}" y="${y + 3}" fill="#111726" font-size="8" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${finger}</text>` : ''}
          `;
        }
      }
    }

    svgEl.innerHTML = svgHtml;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.tabberInspector = new TabberChordInspector();
});
