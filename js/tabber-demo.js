/**
 * Tabber Interactive Guitar Practice Simulator
 * Simulates tabber.fyi's dynamic SVG fretboard chord inspector,
 * ChordPro lyric formatting, ASCII tablature viewer, and hands-free auto-scroller.
 */

class TabberSimulator {
  constructor() {
    this.currentSongId = 'country-roads';
    this.currentChord = 'G';
    this.isAutoScrolling = false;
    this.scrollInterval = null;
    this.scrollSpeed = 1; // 1x or 2x
    this.transposeStep = 0; // semitones

    this.chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    this.chordDatabase = {
      'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
      'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
      'Em7': { frets: [0, 2, 2, 0, 3, 3], fingers: [0, 1, 2, 0, 3, 4], baseFret: 1 },
      'D': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
      'C': { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
      'Am': { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
      'A': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
      'A7sus4': { frets: ['x', 0, 2, 0, 3, 0], fingers: [0, 0, 1, 0, 2, 0], baseFret: 1 },
      'F': { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1, barre: { fret: 1, from: 0, to: 5 } },
      'Bm': { frets: ['x', 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 2, barre: { fret: 2, from: 1, to: 5 } },
      'F#7': { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], baseFret: 2, barre: { fret: 2, from: 0, to: 5 } },
      'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 }
    };

    this.songs = {
      'country-roads': {
        title: 'Country Roads',
        artist: 'John Denver',
        key: 'G',
        capo: '2nd Fret',
        tuning: 'Standard (EADGBE)',
        chords: ['G', 'Em', 'D', 'C', 'F'],
        lyrics: [
          { type: 'section', text: '[Verse 1]' },
          { type: 'line', text: '[G] Almost heaven, [Em] West Virginia' },
          { type: 'line', text: '[D] Blue Ridge Mountains, [C] Shenandoah [G] River' },
          { type: 'line', text: '[G] Life is old there, [Em] older than the trees' },
          { type: 'line', text: '[D] Younger than mountains, [C] growin\' like a [G] breeze' },
          { type: 'section', text: '[Chorus]' },
          { type: 'line', text: 'Country [G] Roads, take me [D] home' },
          { type: 'line', text: 'To the [Em] place I be[C]long' },
          { type: 'line', text: 'West Vir[G]ginia, mountain [D] mama' },
          { type: 'line', text: 'Take me [C] home, country [G] roads' },
          { type: 'section', text: '[Intro Riff]' },
          { type: 'tab', text: 'e|-------3-----------|-------3-----------|\nB|-------3-----------|-------3-----------|\nG|-------0-----------|-------0-----------|\nD|---0h2---2p0-------|---0h2---2p0-------|\nA|-------------2-----|-------------2-----|\nE|-------------------|---------------3---|' }
        ]
      },
      'wish-you-were-here': {
        title: 'Wish You Were Here',
        artist: 'Pink Floyd',
        key: 'G',
        capo: 'None',
        tuning: 'Standard (EADGBE)',
        chords: ['G', 'Em7', 'A7sus4', 'C', 'D', 'Am'],
        lyrics: [
          { type: 'section', text: '[Intro Acoustic Riff]' },
          { type: 'tab', text: 'e|---------3--3--3---|---------3--3--3---|\nB|---------3--3--3---|---------3--3--3---|\nG|---------0--0--0---|---------0--0--0---|\nD|---------2--2--2---|---0--2--0--0--0---|\nA|---0--2------------|-------------------|\nE|-------------------|-------------------|' },
          { type: 'section', text: '[Verse 1]' },
          { type: 'line', text: 'So, so you think you can [C] tell' },
          { type: 'line', text: 'Heaven from [D] hell, blue skies from [Am] pain' },
          { type: 'line', text: 'Can you tell a green [G] field from a cold steel [D] rail?' },
          { type: 'line', text: 'A smile from a [C] veil? Do you think you can [Am] tell?' },
          { type: 'section', text: '[Chorus]' },
          { type: 'line', text: 'How I [C] wish, how I wish you were [D] here' },
          { type: 'line', text: 'We\'re just [Am] two lost souls swimming in a fish [G] bowl' },
          { type: 'line', text: 'Year after [D] year, running over the same old [C] ground' },
          { type: 'line', text: 'What have we [Am] found? The same old fears, wish you were [G] here' }
        ]
      },
      'hotel-california': {
        title: 'Hotel California',
        artist: 'Eagles',
        key: 'Bm',
        capo: '7th Fret',
        tuning: 'Standard (EADGBE)',
        chords: ['Bm', 'F#7', 'A', 'E', 'G', 'D', 'Em'],
        lyrics: [
          { type: 'section', text: '[Verse 1]' },
          { type: 'line', text: '[Bm] On a dark desert highway, [F#7] cool wind in my hair' },
          { type: 'line', text: '[A] Warm smell of colitas, [E] rising up through the air' },
          { type: 'line', text: '[G] Up ahead in the distance, [D] I saw a shimmering light' },
          { type: 'line', text: '[Em] My head grew heavy and my sight grew dim' },
          { type: 'line', text: '[F#7] I had to stop for the night' },
          { type: 'section', text: '[Chorus]' },
          { type: 'line', text: '[G] Welcome to the Hotel Cali[D]fornia' },
          { type: 'line', text: 'Such a [F#7] lovely place, such a [Bm] lovely face' },
          { type: 'line', text: '[G] Plenty of room at the Hotel Cali[D]fornia' },
          { type: 'line', text: 'Any [Em] time of year, you can [F#7] find it here' },
          { type: 'section', text: '[Arpeggiated Staff]' },
          { type: 'tab', text: 'e|---7---7---7---7---|---6---6---6---6---|\nB|---7---7---7---7---|---5---5---5---5---|\nG|---7---7---7---7---|---6---6---6---6---|\nD|---9---9---9---9---|---4---4---4---4---|\nA|-------------------|-------------------|\nE|-------------------|-------------------|' }
        ]
      }
    };

    this.initDOM();
  }

  initDOM() {
    this.container = document.querySelector('.tabber-sim-box');
    if (!this.container) return;

    this.songTabs = this.container.querySelectorAll('.tab-song-pill');
    this.metaKey = document.getElementById('tabber-meta-key');
    this.metaCapo = document.getElementById('tabber-meta-capo');
    this.metaTuning = document.getElementById('tabber-meta-tuning');
    this.chordStrip = document.getElementById('tabber-chords-list');
    this.lyricSheet = document.getElementById('tabber-lyric-sheet');
    this.fretboardSvg = document.getElementById('tabber-fretboard-svg');
    this.chordNameDisplay = document.getElementById('tabber-chord-name');
    this.scrollBtn = document.getElementById('tabber-scroll-toggle-btn');
    this.resetBtn = document.getElementById('tabber-reset-scroll-btn');
    this.speedBtn = document.getElementById('tabber-speed-toggle-btn');
    this.transposeUpBtn = document.getElementById('tabber-transpose-up');
    this.transposeDownBtn = document.getElementById('tabber-transpose-down');

    // Song switcher
    if (this.songTabs) {
      this.songTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.songTabs.forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.currentSongId = e.currentTarget.getAttribute('data-song');
          this.transposeStep = 0;
          this.stopAutoScroll();
          this.loadSong();
        });
      });
    }

    // Scroll controls
    if (this.scrollBtn) {
      this.scrollBtn.addEventListener('click', () => this.toggleAutoScroll());
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.stopAutoScroll();
        if (this.lyricSheet) this.lyricSheet.scrollTop = 0;
      });
    }

    if (this.speedBtn) {
      this.speedBtn.addEventListener('click', () => {
        this.scrollSpeed = this.scrollSpeed === 1 ? 2 : 1;
        this.speedBtn.textContent = `${this.scrollSpeed}x`;
      });
    }

    // Transpose
    if (this.transposeUpBtn) {
      this.transposeUpBtn.addEventListener('click', () => {
        this.transposeStep += 1;
        this.renderChordsAndLyrics();
      });
    }

    if (this.transposeDownBtn) {
      this.transposeDownBtn.addEventListener('click', () => {
        this.transposeStep -= 1;
        this.renderChordsAndLyrics();
      });
    }

    this.loadSong();
  }

  loadSong() {
    const song = this.songs[this.currentSongId];
    if (!song) return;

    if (this.metaKey) this.metaKey.textContent = this.transposeChordName(song.key);
    if (this.metaCapo) this.metaCapo.textContent = song.capo;
    if (this.metaTuning) this.metaTuning.textContent = song.tuning;

    // Pick first chord
    this.currentChord = song.chords[0];
    this.renderChordsAndLyrics();
  }

  transposeChordName(chord) {
    if (!chord) return '';
    if (this.transposeStep === 0) return chord;

    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return chord;

    let root = match[1];
    const modifier = match[2];

    // normalize flat to sharp
    if (root.length === 2 && root[1] === 'b') {
      const flatMap = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
      root = flatMap[root] || root;
    }

    const idx = this.chromaticScale.indexOf(root);
    if (idx === -1) return chord;

    let newIdx = (idx + this.transposeStep) % 12;
    if (newIdx < 0) newIdx += 12;

    return this.chromaticScale[newIdx] + modifier;
  }

  renderChordsAndLyrics() {
    const song = this.songs[this.currentSongId];
    if (!song) return;

    // Render chord pills
    if (this.chordStrip) {
      this.chordStrip.innerHTML = '';
      song.chords.forEach(chord => {
        const transChord = this.transposeChordName(chord);
        const btn = document.createElement('button');
        btn.className = `chord-pill-btn ${transChord === this.transposeChordName(this.currentChord) ? 'active' : ''}`;
        btn.textContent = `[${transChord}]`;
        btn.addEventListener('click', () => {
          this.currentChord = chord;
          this.highlightActiveChord();
          this.renderFretboard(transChord);
        });
        this.chordStrip.appendChild(btn);
      });
    }

    // Render Lyrics & Tabs
    if (this.lyricSheet) {
      this.lyricSheet.innerHTML = '';
      song.lyrics.forEach(item => {
        if (item.type === 'section') {
          const div = document.createElement('div');
          div.style.fontWeight = '700';
          div.style.color = 'var(--text-muted)';
          div.style.marginTop = '0.4rem';
          div.textContent = item.text;
          this.lyricSheet.appendChild(div);
        } else if (item.type === 'line') {
          const div = document.createElement('div');
          div.innerHTML = this.formatChordProLine(item.text);
          this.lyricSheet.appendChild(div);
        } else if (item.type === 'tab') {
          const pre = document.createElement('pre');
          pre.className = 'ascii-tab';
          pre.textContent = item.text;
          this.lyricSheet.appendChild(pre);
        }
      });

      // Bind click events on parsed chord spans
      const chordSpans = this.lyricSheet.querySelectorAll('.tab-chord');
      chordSpans.forEach(span => {
        span.addEventListener('click', (e) => {
          const raw = e.target.getAttribute('data-raw-chord');
          if (raw) {
            this.currentChord = raw;
            this.highlightActiveChord();
            this.renderFretboard(this.transposeChordName(raw));
          }
        });
      });
    }

    this.renderFretboard(this.transposeChordName(this.currentChord));
  }

  formatChordProLine(text) {
    return text.replace(/\[([A-G][^\]]*)\]/g, (match, chord) => {
      const trans = this.transposeChordName(chord);
      const isActive = trans === this.transposeChordName(this.currentChord);
      return `<span class="tab-chord ${isActive ? 'highlight' : ''}" data-raw-chord="${chord}">[${trans}]</span>`;
    });
  }

  highlightActiveChord() {
    const activeTrans = this.transposeChordName(this.currentChord);
    // highlight buttons
    if (this.chordStrip) {
      const buttons = this.chordStrip.querySelectorAll('.chord-pill-btn');
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent === `[${activeTrans}]`);
      });
    }
    // highlight in lyrics
    if (this.lyricSheet) {
      const spans = this.lyricSheet.querySelectorAll('.tab-chord');
      spans.forEach(span => {
        span.classList.toggle('highlight', span.textContent === `[${activeTrans}]`);
      });
    }
  }

  renderFretboard(displayChord) {
    if (this.chordNameDisplay) {
      this.chordNameDisplay.textContent = displayChord || this.currentChord;
    }
    if (!this.fretboardSvg) return;

    // Retrieve chord data fallback
    let chordData = this.chordDatabase[displayChord] || this.chordDatabase[this.currentChord];
    if (!chordData) {
      // generic open shape fallback
      chordData = { frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0], baseFret: 1 };
    }

    const { frets, fingers, baseFret = 1, barre } = chordData;
    const stringX = [14, 28, 42, 56, 70, 84];
    const fretY = [22, 42, 62, 82, 102];

    let svgContent = `
      <rect width="98" height="110" fill="transparent" />
      <!-- Strings -->
    `;

    // 6 vertical strings
    for (let i = 0; i < 6; i++) {
      svgContent += `<line x1="${stringX[i]}" y1="22" x2="${stringX[i]}" y2="102" stroke="var(--border-subtle)" stroke-width="1.5" />`;
    }

    // 5 horizontal frets
    for (let f = 0; f < 5; f++) {
      const isNut = f === 0 && baseFret === 1;
      const strokeW = isNut ? 3 : 1;
      const strokeColor = isNut ? 'var(--carolina-blue-light)' : 'var(--border-subtle)';
      svgContent += `<line x1="14" y1="${fretY[f]}" x2="84" y2="${fretY[f]}" stroke="${strokeColor}" stroke-width="${strokeW}" />`;
    }

    // Fret offset label if baseFret > 1
    if (baseFret > 1) {
      svgContent += `<text x="4" y="36" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)">${baseFret}fr</text>`;
    }

    // Barre chord if present
    if (barre) {
      const barreFretIdx = barre.fret - baseFret;
      if (barreFretIdx >= 0 && barreFretIdx < 4) {
        const yCenter = fretY[barreFretIdx] + 10;
        const x1 = stringX[barre.from];
        const x2 = stringX[barre.to];
        svgContent += `
          <line x1="${x1}" y1="${yCenter}" x2="${x2}" y2="${yCenter}" stroke="var(--accent-amber)" stroke-width="8" stroke-linecap="round" opacity="0.6" />
        `;
      }
    }

    // Markers on top (X / O) and finger dots
    for (let i = 0; i < 6; i++) {
      const fVal = frets[i];
      const finger = fingers ? fingers[i] : 0;
      const x = stringX[i];

      if (fVal === 'x') {
        svgContent += `<text x="${x}" y="14" fill="var(--text-muted)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">×</text>`;
      } else if (fVal === 0) {
        svgContent += `<circle cx="${x}" cy="12" r="3.5" fill="none" stroke="var(--text-muted)" stroke-width="1.2" />`;
      } else {
        const fretOffset = fVal - baseFret;
        if (fretOffset >= 0 && fretOffset < 4) {
          const y = fretY[fretOffset] + 10;
          svgContent += `
            <circle cx="${x}" cy="${y}" r="5" fill="var(--accent-amber)" />
            ${finger > 0 ? `<text x="${x}" y="${y + 3}" fill="#111726" font-size="8" font-weight="bold" text-anchor="middle" font-family="var(--font-mono)">${finger}</text>` : ''}
          `;
        }
      }
    }

    this.fretboardSvg.innerHTML = svgContent;
  }

  toggleAutoScroll() {
    if (this.isAutoScrolling) {
      this.stopAutoScroll();
    } else {
      this.startAutoScroll();
    }
  }

  startAutoScroll() {
    if (!this.lyricSheet) return;
    this.isAutoScrolling = true;
    if (this.scrollBtn) {
      this.scrollBtn.classList.remove('btn-primary');
      this.scrollBtn.classList.add('btn-secondary');
      this.scrollBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        Pause
      `;
    }

    const intervalMs = 60 / this.scrollSpeed;
    this.scrollInterval = setInterval(() => {
      if (!this.lyricSheet) return;
      if (this.lyricSheet.scrollTop + this.lyricSheet.clientHeight >= this.lyricSheet.scrollHeight - 2) {
        // reached bottom, loop or stop
        this.stopAutoScroll();
      } else {
        this.lyricSheet.scrollTop += 1;
      }
    }, intervalMs);
  }

  stopAutoScroll() {
    this.isAutoScrolling = false;
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
    if (this.scrollBtn) {
      this.scrollBtn.classList.add('btn-primary');
      this.scrollBtn.classList.remove('btn-secondary');
      this.scrollBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Auto-Scroll
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.tabberSim = new TabberSimulator();
});

