import { defineDictionary, defineTranslation } from '@adrienlcp/i18n'

/** The reference dictionary: its keys are the type every other locale is held to. */
export const EN_DICTIONARY = defineDictionary({
  backup: {
    count: {
      days: 'Days counted',
      market: 'Items ticked',
      measures: 'Readings',
      sessions: 'Sessions'
    },
    export: 'Export my data',
    fileName: 'The file will be called <b>{name}</b>.',
    head: 'Backup',
    import: 'Import a file',
    incoming: {
      head: 'Backup · The file',
      here: defineTranslation(
        'Here, right now: {sessions:plural}, {measures:plural}.',
        {
          plural: {
            measures: { one: '{?} reading', other: '{?} readings' },
            sessions: { one: '{?} session', other: '{?} sessions' }
          }
        }
      ),
      prose:
        'What the file holds is below. It <b>replaces</b> what is in this browser, it is not added to it: two devices that both ran a session cannot be stitched together without deciding which one is right.',
      replace: 'Replace my data',
      title: 'Replace?'
    },
    prose:
      'Everything the app knows lives in this browser, on this device. Exporting writes a file; importing it elsewhere puts everything back. It is also how you move from the phone to the computer.',
    rejected: 'This file is not a backup from the app. Nothing was touched.',
    title: 'A file, nothing else.',
    unknownDate: 'unknown date'
  },
  common: {
    back: 'Back',
    backToSession: 'Back to the session',
    cancel: 'Cancel',
    clock: defineTranslation('{time:date}', {
      date: { time: { hour: '2-digit', minute: '2-digit' } }
    }),
    longDay: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', month: 'long', weekday: 'long' } }
    }),
    minus: '−',
    none: '—',
    plus: '+',
    rank: '{position} / {total}',
    seconds: '{count} s',
    toJournal: 'The journal',
    toProgress: 'The curves',
    toReport: 'The report',
    toSettings: 'Settings',
    toTable: 'The table',
    unit: {
      rep: 'rep',
      reps: 'reps',
      seconds: 'seconds'
    },
    week: 'Week {week}'
  },
  documentTitle: {
    app: 'Séance',
    backup: 'Backup — Séance',
    contactSheet: 'Contact sheet — Séance',
    decomposition: 'Decomposition — Séance',
    erratum: 'Erratum — Séance',
    figure: 'Figure — Séance',
    journal: 'Journal — Séance',
    measure: 'Reading — Séance',
    progress: 'Progress — Séance',
    report: 'Report — Séance',
    settings: 'Settings — Séance',
    specimen: 'Specimen — Séance',
    table: 'Table — Séance'
  },
  erratum: {
    crash: {
      headline: 'This plate came out wrong.',
      prose:
        'An error interrupted the page. Nothing you noted is lost: the journal and the session in progress are kept in this browser, and the session resumes at its exact address.',
      reason: 'Reason',
      reload: 'Reload the page'
    },
    head: 'Erratum',
    missing: {
      headline: 'This plate does not exist.',
      prose:
        'No plate of the manual has this address. Tonight’s session opens all the others: the journal, the curves, the table, the settings.'
    }
  },
  figure: {
    missing: 'No figure “{id}”.',
    replay: 'Watch the movement again'
  },
  format: {
    decimal: defineTranslation('{value:number}', {
      number: { value: { maximumFractionDigits: 1, minimumFractionDigits: 1 } }
    }),
    shortDay: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', month: 'short' } }
    }),
    whole: defineTranslation('{value:number}', {
      number: { value: { maximumFractionDigits: 0 } }
    })
  },
  journal: {
    measure: {
      correction: 'Correction',
      head: 'Journal · The reading',
      kilograms: 'kg',
      nothing: 'Nothing to note',
      prose:
        '{day}. Once a week, in the morning, before breakfast: the same moment every time is what makes two readings comparable.',
      save: 'Note it',
      title: 'The reading.',
      waistHint:
        'At the navel, standing, without pulling the stomach in. It is the measure that settles it.',
      weight: 'Weight',
      weightHint: 'Noted for the record. Day to day, it is mostly water.'
    },
    noReading: {
      how: 'Once a week, in the morning before breakfast, at the navel, standing, stomach relaxed. No more often than that.',
      why: 'No reading yet. The waist is the measure that settles it: the scale can stay still for weeks while everything moves.'
    },
    noteReading: 'Note a reading',
    numbers: {
      count: defineTranslation(
        '<b>{sessions}</b> sessions, over {weeks:plural}.',
        {
          plural: { weeks: { one: '{?} week', other: '{?} weeks' } }
        }
      ),
      empty:
        'No session yet. The first evening compares against nothing: it sets the starting numbers, and the push-up count taken then picks the variant for the whole block.',
      movement: 'Movement',
      runs: '{runs} times',
      runsStopped: defineTranslation('{runs} times, {stopped:plural}', {
        plural: { stopped: { one: '{?} stopped', other: '{?} stopped' } }
      }),
      session: '{id} — {name}',
      timedName: '{name} (s)',
      title: 'The numbers',
      weekColumn: 'W{week}'
    },
    readings: {
      centimetres: 'cm',
      driftBoth:
        'Since the first reading: <b>{waist} cm</b> at the waist, {weight} kg.',
      driftWaist: 'Since the first reading: <b>{waist} cm</b>.',
      inCentimetres: '{value} cm',
      inKilograms: '{value} kg',
      reading: 'Reading',
      waist: 'Waist',
      waistColumn: 'Waist',
      weight: 'Weight',
      weightColumn: 'Weight'
    },
    title: 'Journal · The register'
  },
  progress: {
    body: {
      empty:
        'No reading yet. Note one a week from the journal, and the two curves draw themselves here.',
      hint: 'Two curves, two scales: the waist and the weight never share an axis.',
      summary: 'From {first} on {firstDay} to {last} on {lastDay}.',
      title: 'The body',
      value: '{value} {unit}'
    },
    empty: {
      prose:
        'The curves fill from the journal: sessions run, readings noted. To see them full before a first session, open the <b>specimen</b> — a made-up profile, kept apart from your numbers.',
      title: 'Nothing to draw yet.'
    },
    head: 'Progress · The curves',
    holds: {
      readout: defineTranslation('{minutes:number} min held', {
        number: { minutes: { maximumFractionDigits: 1 } }
      }),
      summary: defineTranslation(
        '{minutes:number} minutes held over the last {weeks:number} weeks.',
        { number: { minutes: { maximumFractionDigits: 0 } } }
      ),
      title: 'Minutes held per week'
    },
    key: {
      stopped: 'Stopped early',
      whole: 'Run to the end'
    },
    numbers: {
      held: 'Held',
      minutes: defineTranslation('{minutes:number} min', {
        number: { minutes: { maximumFractionDigits: 1 } }
      }),
      reps: 'Reps',
      sessions: 'Sessions',
      stopped: 'Stopped',
      title: 'The numbers',
      week: 'Week of'
    },
    rank: '{weeks:number} weeks',
    regularity: {
      current: 'Current run',
      day: {
        future: 'To come',
        none: 'Rest',
        stopped: 'Session stopped early',
        whole: 'Session run'
      },
      dayLabel: defineTranslation('{day:date}', {
        date: { day: { day: 'numeric', month: 'short', weekday: 'short' } }
      }),
      gridCaption: 'Training days',
      gridSummary: defineTranslation(
        '{trained:plural} over the last {weeks:number} weeks.',
        {
          plural: {
            trained: { one: '{?} day trained', other: '{?} days trained' }
          }
        }
      ),
      hint: 'Counted in weeks, never in days: a rest day is part of the programme. A week is steady from {sessions} sessions.',
      longest: 'Longest run',
      steady: 'Steady weeks',
      steadyOf: '{steady} of {total}',
      title: 'Regularity',
      weekday: defineTranslation('{day:date}', {
        date: { day: { weekday: 'narrow' } }
      }),
      weeks: defineTranslation('{weeks:plural}', {
        plural: { weeks: { one: '{?} week', other: '{?} weeks' } }
      })
    },
    sessions: {
      readout: defineTranslation('{sessions:plural}', {
        plural: {
          sessions: { one: '{?} session', other: '{?} sessions' }
        }
      }),
      stoppedDetail: defineTranslation('{stopped:plural}', {
        plural: {
          stopped: { one: '{?} stopped early', other: '{?} stopped early' }
        }
      }),
      summary: defineTranslation(
        '{sessions:plural} over the last {weeks:number} weeks.',
        {
          plural: {
            sessions: { one: '{?} session', other: '{?} sessions' }
          }
        }
      ),
      title: 'Sessions per week'
    },
    volume: {
      hint: 'Every repetition counted, every set, every round.',
      readout: defineTranslation('{reps:number} reps', {
        number: { reps: { maximumFractionDigits: 0 } }
      }),
      summary: defineTranslation(
        '{reps:number} repetitions over the last {weeks:number} weeks.',
        { number: { reps: { maximumFractionDigits: 0 } } }
      ),
      title: 'Repetitions per week'
    },
    weekOf: 'Week of {day}'
  },
  pwa: {
    install: {
      action: 'Install',
      decline: 'Not now',
      text: 'Install Séance: it opens full screen and runs with no network at all.'
    },
    update: {
      action: 'Reload',
      text: 'A new printing of the manual is ready.'
    }
  },
  reminders: {
    notification: {
      body: 'Time for tonight’s session. Thirty minutes; the rest is written.',
      title: 'Séance'
    }
  },
  report: {
    copy: 'Copy the report',
    document: {
      adjustment: '- Next time:',
      centimetres: defineTranslation('{value:number} cm', {
        number: { value: { maximumFractionDigits: 1 } }
      }),
      done: '- Done:',
      feeling: '- How it felt:',
      grams: defineTranslation('{value:number} g', {
        number: { value: { maximumFractionDigits: 1 } }
      }),
      introAll: 'Everything the app has kept, ready to paste into your notes.',
      introEvening: 'What today put down, ready to paste into your notes.',
      kilograms: defineTranslation('{value:number} kg', {
        number: { value: { maximumFractionDigits: 1 } }
      }),
      measureHeader: 'Date | Weight | Waist',
      measuresHeading: '## Readings',
      movement: '  - {name} — {values}',
      notDone: 'not done',
      portions: '{name} ×{count}',
      proteinHeader: 'Day | Protein | Counted',
      proteinHeading: '## Protein',
      proteinMean: defineTranslation(
        'Mean: {mean:number} g over {days:plural}. Target: {target} g.',
        {
          number: { mean: { maximumFractionDigits: 1 } },
          plural: {
            days: { one: '{?} day counted', other: '{?} days counted' }
          }
        }
      ),
      proteinWeek: defineTranslation('### Week of {week:date}', {
        date: { week: { day: 'numeric', month: 'long', year: 'numeric' } }
      }),
      session: '### {day} — Session {id} ({name})',
      sessionStopped: '### {day} — Session {id} ({name}) — stopped early',
      sessionsHeading: '## Sessions',
      title: defineTranslation('# Report — {date:date}', {
        date: {
          date: {
            day: 'numeric',
            month: 'long',
            weekday: 'long',
            year: 'numeric'
          }
        }
      })
    },
    emptyProse:
      'No session run, no reading, no day counted. The report prints what the app has kept; for now it has nothing.',
    emptyTitle: 'Nothing to print.',
    head: 'Report',
    prose:
      'The app has no server, on purpose: it writes the text and hands it over. How it felt and what to change next are left open — only you know those.',
    refused:
      'The browser refused the clipboard. The text is selected above: Ctrl+C takes it.',
    taken: 'Copied. Paste it wherever you keep your notes.',
    title: 'For your notes.',
    tonight: 'Tonight'
  },
  session: {
    cooldown: {
      finished: 'Session done',
      name: 'Cool-down',
      nextStretch: 'Next stretch',
      otherSide: 'The same, other side',
      skip: 'Skip the stretches'
    },
    cues: {
      breath: 'Breathe',
      detailsClose: 'Back to the cues',
      detailsOpen: 'The movement in detail',
      detailsSteps: '{count} steps',
      moves: 'Moves',
      squeeze: 'Squeeze',
      still: 'Still',
      stop: 'Stop two reps before failure, or as soon as the form slips. The number is a target.',
      stopCalibration:
        'Tonight only, go to the end: as many clean reps as you can. After tonight, always stop two short.',
      stopTerm: 'Stop',
      supportNone:
        'None: no wall, no furniture. The balance is part of the work.',
      supportTerm: 'Support',
      supportWall: 'Fingertips on a wall for balance, never to lean on it.',
      tempo: {
        bottom: '{seconds} s at the bottom',
        down: 'down {seconds} s',
        lead: 'The figure’s: {phases}',
        noBounce: 'no bounce',
        top: '{seconds} s at the top',
        up: 'up {seconds} s'
      },
      tempoTerm: 'Tempo'
    },
    done: {
      before: 'Before',
      close: 'Close the plate',
      doneName: 'Done',
      doneProse: 'The numbers are down. Next time, they are the ones to beat.',
      doneTitle: 'Session done.',
      movement: 'Movement',
      stoppedName: 'Stopped',
      stoppedProse:
        'What was done is recorded, and the session counts as done: the next one is waiting. The journal keeps a note of the stop.',
      stoppedTitle: 'Session ended early.',
      tonight: 'Tonight'
    },
    free: {
      end: 'End the session',
      lengthFact: '5 min',
      nextFact: 'The week is done',
      prescribedFact: 'Nothing',
      prescribedTerm: 'Prescribed',
      prose:
        'Five minutes of whatever the body asks for. Nothing is prescribed here: it is the one moment of the week the programme does not say what to do.'
    },
    ledger: {
      done: 'Done',
      live: 'Now'
    },
    leftSide: 'Left side',
    next: 'Next',
    plateTitle: 'Plate {id} · {name}',
    previousSet: 'Previous set',
    rest: {
      name: 'Rest',
      nextSet: '{name} — {effort}',
      round: 'Round {round} / {rounds}',
      skip: 'Skip the rest'
    },
    rightSide: 'Right side',
    set: {
      done: 'Set done',
      fewer: 'One rep fewer',
      lastWeek: 'last week: <b>{beat}</b>',
      more: 'One rep more',
      overtime: '+',
      perSide: 'per side',
      restThenRound: 'Rest, then round {round}',
      round: 'Round',
      stretches: 'Stretches',
      timeUp: 'Time reached',
      toMeasure: 'to measure'
    },
    start: 'Start',
    stop: 'Stop the circuit',
    switchSide: 'Switch sides',
    title: {
      breathFact: 'Out on the effort, in on the easy half. Never hold it.',
      calibration: 'Tonight, we measure.',
      calibrationLength: 'Once started, nothing to decide: the plates lead.',
      calibrationProse:
        'Nothing to beat yet. Session {id} sets the starting numbers: tonight only, as many clean reps as you can. After tonight, every set stops two reps before failure.',
      defaultNote: 'Everything is written: follow the plates.',
      done: 'Done',
      due: 'Due',
      kitFact: 'A mat, nothing else',
      kitTerm: 'Kit',
      lengthFact: 'About {minutes} min',
      lengthTerm: 'Length',
      named: '{name}.',
      picked: 'Picked',
      register: 'Tap a session to pick it',
      restart: 'Run {id} again',
      roundsFact: '{rounds} this week — week {week}',
      roundsTerm: 'Rounds',
      rules: 'The rules of every set',
      start: 'Begin session {id}',
      supportFact:
        'On one leg, fingertips on a wall for balance — never to lean on it.',
      tempoFact: 'Down 2 s, up 1 s, no bounce: follow the figure.'
    },
    warmup: {
      circuit: 'The circuit',
      name: 'Warm-up',
      nextDrill: 'Next movement',
      toCircuit: 'To the circuit'
    }
  },
  settings: {
    chosen: 'Chosen',
    data: {
      backup: 'Backup: export, import',
      prose:
        'Every number lives in this browser, on this device, and is sent nowhere. A backup file carries it to another device.',
      title: 'Your data'
    },
    device: 'This device',
    head: 'Settings',
    install: {
      action: 'Install the app',
      apple:
        'On iPhone and iPad: Share, then “Add to Home Screen”. It then opens full screen and runs offline.',
      installed: 'Installed on this device.',
      menu: 'This browser offers no install button here; its menu may hold “Install app” or “Add to Home Screen”.',
      offered:
        'Installed, Séance opens from the home screen, full screen, and runs with no network at all.',
      offlinePending: 'Being saved on this device…',
      offlineReady: 'The whole manual is on this device.',
      offlineTerm: 'Offline',
      title: 'Install'
    },
    language: {
      name: {
        en: 'English',
        fr: 'Français'
      },
      title: 'Language'
    },
    numbers: 'Your numbers',
    protein: {
      hint: 'About 1.6 g per kilo of body weight, between {min} and {max} g. The table counts toward it.',
      invalid: 'A whole number of grams, between {min} and {max}.',
      label: 'Grams a day',
      title: 'Protein target'
    },
    reminders: {
      dayCell: {
        friday: 'Fr',
        monday: 'Mo',
        saturday: 'Sa',
        sunday: 'Su',
        thursday: 'Th',
        tuesday: 'Tu',
        wednesday: 'We'
      },
      days: 'Days',
      enable: 'Remind me to train',
      permission: {
        default: 'The browser will ask before the first reminder.',
        denied:
          'Notifications are blocked for this site: allow them in the browser’s site settings.',
        granted: 'Notifications are allowed on this device.',
        unsupported: 'This browser cannot show notifications.'
      },
      reach: {
        closedTerm: 'App closed',
        none: 'Nothing can wake it: this browser gives web apps no alarm clock, and Séance has no server to push from. Open it once on the day, and the reminder is kept.',
        open: 'The reminder arrives on time, even in a background tab.',
        openTerm: 'App open',
        periodic:
          'The browser wakes the app a few times a day to check — close to the time, never to the minute.',
        periodicOnceInstalled:
          'Once installed, the browser wakes the app a few times a day to check — close to the time, never to the minute.',
        scheduled:
          'This browser takes the reminders ahead of time and shows them with the app closed.'
      },
      sendTest: 'Send a test',
      sound: 'With the system sound',
      test: {
        denied: 'The test was refused: notifications are not allowed.',
        failed: 'The test could not be shown.',
        sent: 'Test sent.',
        unsupported: 'This browser cannot show one.'
      },
      testBody: 'This is what a reminder looks like.',
      time: 'Time',
      title: 'Reminders',
      weekday: defineTranslation('{day:date}', {
        date: { day: { weekday: 'long' } }
      })
    },
    theme: {
      dark: 'Dark',
      light: 'Light',
      system: 'Follow the device',
      title: 'Printing'
    },
    wipe: {
      arm: 'Erase the sessions',
      cleared: 'Sessions erased. The next one is the calibration evening.',
      confirm: 'Yes, erase them all',
      confirmProse:
        'Sessions recorded on this device: {count}. Without a backup, they will not come back.',
      empty: 'No session recorded',
      prose:
        'Erases the recorded sessions and the push-up test — for sessions run only to try the app. The next session becomes the calibration evening again. Measures, settings and the table stay.',
      title: 'Start from zero'
    }
  },
  specimen: {
    band: 'made-up numbers.',
    leave: 'My numbers',
    open: 'Open the specimen',
    prose:
      'A made-up profile — twelve weeks of sessions, readings and counted days — to see every plate and every curve full. It lives apart: your own numbers are never read or touched.',
    readingProse:
      'You are reading the specimen. Everything you do here stays in it; your own numbers wait untouched.',
    reset: 'Print it again',
    stamp: 'Specimen',
    title: 'Specimen'
  },
  table: {
    count: {
      add: 'Count {name}, {portion}, {grams} grams',
      firstCount: 'First count. There is nothing behind it yet.',
      head: 'Table · The count',
      met: 'The count is made.',
      of: 'of {target}',
      prior: 'Yesterday: <b>{yesterday} g</b>.',
      priorWithMean:
        'Yesterday: <b>{yesterday} g</b>. Mean of the last {days} days: <b>{mean} g</b>.',
      remove: 'Take off one portion of {name}',
      shareGrams: '{grams} g',
      short: '<b>{grams} g</b> to go.',
      sourcesHint:
        'One line, one portion. The right-hand column says what the portion brings.',
      sourcesTitle: 'What counts',
      taps: '× {taps}',
      unit: 'g',
      why: '{target} g a day. It is the only thing counted: protein keeps you full and keeps the muscle while the waist comes down. No calories to weigh.',
      yield: '{grams} g'
    },
    // The band is already in tracked capitals; the full month would crowd it
    // against the title on a phone.
    date: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', weekday: 'long' } }
    }),
    grams: defineTranslation('{value:number}', {
      number: { value: { maximumFractionDigits: 1 } }
    }),
    market: {
      clear: 'Untick all',
      count: '<b>{done}</b> of {total}',
      countDone: '<b>{done}</b> of {total} — the list is done',
      head: 'Table · The shopping',
      prose:
        'The same every week: repetition is what makes it hold, not variety. The list empties itself on Friday.'
    },
    pot: {
      basesHint: 'Twenty minutes each, because the session comes first.',
      basesTitle: 'The five bases',
      head: 'Table · The pot',
      insideHint:
        '<b>{target} g</b> of protein in the pot, for 40 in each portion.',
      insideTitle: 'What goes in',
      plateHint: 'Lunch and dinner, no scale. The hand follows the body.',
      plateTitle: 'The plate',
      prose:
        'Cook a double batch in the evening, eat half, take the other half for lunch the next day. What changes is what goes in the pot.',
      shareDetail: ' — {detail}',
      title: 'One pot, two meals.'
    },
    register: {
      count: 'The count',
      countNote: '{total} / {target}',
      market: 'The shopping',
      pot: 'The pot',
      potBases: '5 bases'
    }
  }
})
