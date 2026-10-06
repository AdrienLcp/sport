import { defineDictionary, defineTranslation } from '@adrienlcp/i18n'

/*
 * Held to the English reference by the registry. French typography puts a
 * no-break space before « : », « ; », « ? » and between a number and its unit.
 */
export const FR_DICTIONARY = defineDictionary({
  backup: {
    count: {
      days: 'Jours comptés',
      market: 'Courses cochées',
      measures: 'Relevés',
      sessions: 'Séances'
    },
    export: 'Exporter mes données',
    fileName: 'Le fichier s’appellera <b>{name}</b>.',
    head: 'Sauvegarde',
    import: 'Importer un fichier',
    incoming: {
      head: 'Sauvegarde · Le fichier',
      here: defineTranslation(
        'Ici, en ce moment : {sessions:plural}, {measures:plural}.',
        {
          plural: {
            measures: { one: '{?} relevé', other: '{?} relevés' },
            sessions: { one: '{?} séance', other: '{?} séances' }
          }
        }
      ),
      prose:
        'Ce que le fichier contient est ci-dessous. Il <b>remplace</b> ce qui est dans ce navigateur, il ne s’y ajoute pas : deux appareils qui ont tous les deux fait une séance ne se recollent pas sans décider lequel a raison.',
      replace: 'Remplacer mes données',
      title: 'Remplacer ?'
    },
    prose:
      'Tout ce que l’app sait vit dans ce navigateur, sur cet appareil. Exporter écrit un fichier ; l’importer ailleurs y remet tout. C’est aussi comme ça qu’on passe du téléphone au PC.',
    rejected:
      'Ce fichier n’est pas une sauvegarde de l’app. Rien n’a été touché.',
    title: 'Un fichier, rien d’autre.',
    unknownDate: 'date inconnue'
  },
  common: {
    back: 'Retour',
    backToSession: 'Retour à la séance',
    cancel: 'Annuler',
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
    seconds: '{count} s',
    toJournal: 'Le journal',
    toProgress: 'Les courbes',
    toReport: 'Le compte rendu',
    toSettings: 'Réglages',
    toTable: 'La table',
    unit: {
      rep: 'répétition',
      reps: 'répétitions',
      seconds: 'secondes'
    },
    week: 'Semaine {week}'
  },
  documentTitle: {
    app: 'Séance',
    backup: 'Sauvegarde — Séance',
    contactSheet: 'Planche contact — Séance',
    decomposition: 'Décomposition — Séance',
    erratum: 'Erratum — Séance',
    figure: 'Figure — Séance',
    journal: 'Journal — Séance',
    measure: 'Relevé — Séance',
    progress: 'Progrès — Séance',
    report: 'Compte rendu — Séance',
    settings: 'Réglages — Séance',
    specimen: 'Spécimen — Séance',
    table: 'Table — Séance'
  },
  erratum: {
    crash: {
      headline: 'Cette planche s’est mal imprimée.',
      prose:
        'Une erreur a interrompu l’affichage. Rien de ce qui était noté n’est perdu : le journal et la séance en cours sont gardés dans ce navigateur, et la séance reprend à son adresse exacte.',
      reason: 'Motif',
      reload: 'Recharger la page'
    },
    head: 'Erratum',
    missing: {
      headline: 'Cette planche n’existe pas.',
      prose:
        'Aucune planche du manuel ne porte cette adresse. La séance du jour ouvre toutes les autres : le journal, les courbes, la table, les réglages.'
    }
  },
  figure: {
    front: 'De face',
    missing: 'Aucune figure « {id} ».',
    replay: 'Revoir le geste',
    side: 'De profil'
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
      head: 'Journal · Le relevé',
      kilograms: 'kg',
      nothing: 'Rien à noter',
      prose:
        '{day}. Une fois par semaine, le matin, avant le petit-déjeuner : le même moment à chaque fois, c’est ce qui rend deux relevés comparables.',
      save: 'Noter',
      title: 'Le relevé.',
      waistHint:
        'Au nombril, debout, sans rentrer le ventre. C’est la mesure qui tranche.',
      weight: 'Poids',
      weightHint: 'Noté pour mémoire. Au jour le jour, ce n’est que de l’eau.'
    },
    noReading: {
      how: 'Une fois par semaine, le matin à jeun, au nombril, debout, sans rentrer le ventre. Pas plus souvent.',
      why: 'Aucun relevé. Le tour de taille est la mesure qui tranche : la balance peut ne pas bouger pendant des semaines alors que tout avance.'
    },
    noteReading: 'Noter le relevé',
    numbers: {
      count: defineTranslation(
        '<b>{sessions}</b> séances, sur {weeks:plural}.',
        {
          plural: { weeks: { one: '{?} semaine', other: '{?} semaines' } }
        }
      ),
      empty:
        'Aucune séance faite. Le premier soir ne se compare à rien : il pose les chiffres de départ, et c’est le nombre de pompes relevé là qui fixe la variante pour tout le bloc.',
      movement: 'Mouvement',
      runs: '{runs} fois',
      runsStopped: defineTranslation('{runs} fois, dont {stopped:plural}', {
        plural: { stopped: { one: '{?} arrêtée', other: '{?} arrêtées' } }
      }),
      session: '{id} — {name}',
      timedName: '{name} (s)',
      title: 'Les chiffres',
      weekColumn: 'S{week}'
    },
    readings: {
      centimetres: 'cm',
      driftBoth:
        'Depuis le premier relevé : <b>{waist} cm</b> de tour de taille, {weight} kg.',
      driftWaist: 'Depuis le premier relevé : <b>{waist} cm</b>.',
      inCentimetres: '{value} cm',
      inKilograms: '{value} kg',
      reading: 'Relevé',
      waist: 'Tour de taille',
      waistColumn: 'Taille',
      weight: 'Poids',
      weightColumn: 'Poids'
    },
    title: 'Journal · Le registre'
  },
  progress: {
    body: {
      empty:
        'Aucun relevé. Note-en un par semaine depuis le journal, et les deux courbes se tracent ici.',
      hint: 'Deux courbes, deux échelles : le tour de taille et le poids ne partagent jamais un axe.',
      summary: 'De {first} le {firstDay} à {last} le {lastDay}.',
      title: 'Le corps',
      value: '{value} {unit}'
    },
    empty: {
      prose:
        'Les courbes se remplissent depuis le journal : séances faites, relevés notés. Pour les voir pleines avant une première séance, ouvre le <b>spécimen</b> — un profil inventé, tenu à l’écart de tes chiffres.',
      title: 'Rien à tracer encore.'
    },
    head: 'Progrès · Les courbes',
    holds: {
      readout: defineTranslation('{minutes:number} min tenues', {
        number: { minutes: { maximumFractionDigits: 1 } }
      }),
      summary: defineTranslation(
        '{minutes:number} minutes tenues sur les {weeks:number} dernières semaines.',
        { number: { minutes: { maximumFractionDigits: 0 } } }
      ),
      title: 'Minutes tenues par semaine'
    },
    key: {
      stopped: 'Arrêtée en cours',
      whole: 'Menée au bout'
    },
    numbers: {
      held: 'Tenu',
      minutes: defineTranslation('{minutes:number} min', {
        number: { minutes: { maximumFractionDigits: 1 } }
      }),
      reps: 'Répét.',
      sessions: 'Séances',
      stopped: 'Arrêtées',
      title: 'Les chiffres',
      week: 'Semaine du'
    },
    rank: '{weeks:number} semaines',
    regularity: {
      current: 'Série en cours',
      day: {
        future: 'À venir',
        none: 'Repos',
        stopped: 'Séance arrêtée en cours',
        whole: 'Séance faite'
      },
      dayLabel: defineTranslation('{day:date}', {
        date: { day: { day: 'numeric', month: 'short', weekday: 'short' } }
      }),
      gridCaption: 'Jours d’entraînement',
      gridSummary: defineTranslation(
        '{trained:plural} sur les {weeks:number} dernières semaines.',
        {
          plural: {
            trained: {
              one: '{?} jour d’entraînement',
              other: '{?} jours d’entraînement'
            }
          }
        }
      ),
      hint: 'Compté en semaines, jamais en jours : un jour de repos fait partie du programme. Une semaine est régulière à partir de {sessions} séances.',
      longest: 'Plus longue série',
      steady: 'Semaines régulières',
      steadyOf: '{steady} sur {total}',
      title: 'Régularité',
      weekday: defineTranslation('{day:date}', {
        date: { day: { weekday: 'narrow' } }
      }),
      weeks: defineTranslation('{weeks:plural}', {
        plural: { weeks: { one: '{?} semaine', other: '{?} semaines' } }
      })
    },
    sessions: {
      readout: defineTranslation('{sessions:plural}', {
        plural: {
          sessions: { one: '{?} séance', other: '{?} séances' }
        }
      }),
      stoppedDetail: defineTranslation('{stopped:plural}', {
        plural: {
          stopped: {
            one: 'dont {?} arrêtée en cours',
            other: 'dont {?} arrêtées en cours'
          }
        }
      }),
      summary: defineTranslation(
        '{sessions:plural} sur les {weeks:number} dernières semaines.',
        {
          plural: {
            sessions: { one: '{?} séance', other: '{?} séances' }
          }
        }
      ),
      title: 'Séances par semaine'
    },
    volume: {
      hint: 'Chaque répétition comptée, chaque série, chaque tour.',
      readout: defineTranslation('{reps:number} répétitions', {
        number: { reps: { maximumFractionDigits: 0 } }
      }),
      summary: defineTranslation(
        '{reps:number} répétitions sur les {weeks:number} dernières semaines.',
        { number: { reps: { maximumFractionDigits: 0 } } }
      ),
      title: 'Répétitions par semaine'
    },
    weekOf: 'Semaine du {day}'
  },
  pwa: {
    install: {
      action: 'Installer',
      decline: 'Pas maintenant',
      text: 'Installer Séance : elle s’ouvre en plein écran et tourne sans aucun réseau.'
    },
    update: {
      action: 'Recharger',
      text: 'Une nouvelle édition du manuel est prête.'
    }
  },
  reminders: {
    notification: {
      body: 'C’est l’heure de la séance. Trente minutes ; le reste est écrit.',
      title: 'Séance'
    }
  },
  report: {
    copy: 'Copier le compte rendu',
    document: {
      centimetres: defineTranslation('{value:number} cm', {
        number: { value: { maximumFractionDigits: 1 } }
      }),
      done: '- Fait :',
      feeling: '- Ressenti : (à écrire avant d’envoyer)',
      grams: defineTranslation('{value:number} g', {
        number: { value: { maximumFractionDigits: 1 } }
      }),
      introAll: 'Tout ce que l’app a gardé, prêt à coller dans tes notes.',
      introEvening:
        'Ce que cette journée a posé, prêt à coller dans tes notes.',
      kilograms: defineTranslation('{value:number} kg', {
        number: { value: { maximumFractionDigits: 1 } }
      }),
      measureHeader: 'Date | Poids | Tour de taille',
      measuresHeading: '## Relevés',
      movement: '  - {name} — {values}',
      notDone: 'non fait',
      portions: '{name} ×{count}',
      proteinHeader: 'Jour | Protéines | Compté',
      proteinHeading: '## Protéines',
      proteinMean: defineTranslation(
        'Moyenne : {mean:number} g sur {days:plural}. Cible : {target} g.',
        {
          number: { mean: { maximumFractionDigits: 1 } },
          plural: {
            days: { one: '{?} jour compté', other: '{?} jours comptés' }
          }
        }
      ),
      proteinWeek: defineTranslation('### Semaine du {week:date}', {
        date: { week: { day: 'numeric', month: 'long', year: 'numeric' } }
      }),
      session: '### {day} — Séance {id} ({name})',
      sessionStopped: '### {day} — Séance {id} ({name}) — arrêtée en cours',
      sessionsHeading: '## Séances',
      title: defineTranslation('# Compte rendu — {date:date}', {
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
      'Aucune séance faite, aucun relevé, aucun jour compté. Le compte rendu sort ce que l’app a gardé ; pour l’instant elle n’a rien.',
    emptyTitle: 'Rien à sortir.',
    head: 'Compte rendu',
    prose:
      'L’app n’a pas de serveur, et c’est voulu : elle écrit le texte et te le tend. Le ressenti et ce qu’il faut changer restent ouverts — toi seul les connais.',
    refused:
      'Le navigateur a refusé le presse-papiers. Le texte est sélectionné au-dessus : Ctrl+C le prend.',
    taken: 'Copié. Colle-le là où tu gardes tes notes.',
    title: 'Pour tes notes.',
    tonight: 'Ce soir'
  },
  session: {
    cooldown: {
      finished: 'Séance faite',
      name: 'Retour au calme',
      nextStretch: 'Étirement suivant',
      otherSide: 'Le même, autre côté',
      skip: 'Passer les étirements'
    },
    cues: {
      breath: 'Souffle',
      detailsClose: 'Retour aux repères',
      detailsOpen: 'Le geste en détail',
      detailsSteps: '{count} étapes',
      moves: 'Bouge',
      squeeze: 'Serre',
      still: 'Fixe',
      stop: 'Deux répétitions avant l’échec, ou dès que le geste se dégrade. Le chiffre est une cible.',
      stopCalibration:
        'Ce soir seulement, jusqu’au bout : autant de répétitions propres que possible. Ensuite, toujours deux avant l’échec.',
      stopTerm: 'Arrêt',
      supportNone:
        'Aucun : ni mur ni meuble, l’équilibre fait partie du travail.',
      supportTerm: 'Appui',
      supportWall:
        'Bout des doigts au mur pour l’équilibre, jamais pour s’y appuyer.',
      tempo: {
        bottom: '{seconds} s en bas',
        down: 'descente {seconds} s',
        lead: 'Celui de la figure : {phases}',
        noBounce: 'sans rebond',
        top: '{seconds} s en haut',
        up: 'montée {seconds} s'
      },
      tempoTerm: 'Rythme'
    },
    done: {
      before: 'Avant',
      close: 'Fermer la planche',
      doneName: 'Fini',
      doneProse:
        'Les chiffres sont posés. La prochaine fois, ce sont eux qu’il faudra battre.',
      doneTitle: 'Séance faite.',
      movement: 'Mouvement',
      stoppedName: 'Arrêtée',
      stoppedProse:
        'Ce qui a été fait est enregistré, et la séance compte comme faite : la suivante t’attend. Le journal garde la trace de l’arrêt.',
      stoppedTitle: 'Séance terminée plus tôt.',
      tonight: 'Ce soir'
    },
    free: {
      end: 'Terminer la séance',
      lengthFact: '5 min',
      nextFact: 'La semaine est finie',
      prescribedFact: 'Rien',
      prescribedTerm: 'Prescrit',
      prose:
        'Cinq minutes, ce que le corps demande. Rien n’est prescrit ici : c’est le seul moment de la semaine où le programme ne dit pas quoi faire.'
    },
    ledger: {
      done: 'Fait',
      live: 'En cours'
    },
    leftSide: 'Côté gauche',
    next: 'Ensuite',
    plateTitle: 'Planche {id} · {name}',
    previousSet: 'Série précédente',
    rest: {
      name: 'Repos',
      nextSet: '{name} — {effort}',
      round: 'Tour {round} / {rounds}',
      skip: 'Passer le repos'
    },
    rightSide: 'Côté droit',
    set: {
      done: 'Série faite',
      fewer: 'Une répétition de moins',
      lastWeek: 'la semaine dernière : <b>{beat}</b>',
      more: 'Une répétition de plus',
      perSide: 'par côté',
      restThenRound: 'Repos, puis tour {round}',
      round: 'Tour',
      stretches: 'Étirements',
      timeUp: 'Temps atteint',
      toMeasure: 'à mesurer'
    },
    start: 'Démarrer',
    stop: 'Arrêter le circuit',
    switchSide: 'Changer de côté',
    title: {
      breathFact:
        'On souffle dans l’effort, on inspire dans la phase facile. Jamais d’apnée.',
      defaultNote: 'Tout est écrit : suis les planches.',
      done: 'Faite',
      due: 'Prévue',
      kitFact: 'Un tapis, rien d’autre',
      kitTerm: 'Matériel',
      lengthFact: 'Environ {minutes} min',
      lengthTerm: 'Durée',
      measure: 'Mesurer mes chiffres sur la {id}',
      named: '{name}.',
      picked: 'Choisie',
      register: 'Touche une séance pour la choisir',
      restart: 'Refaire la séance {id}',
      roundsFact: '{rounds} cette semaine — semaine {week}',
      roundsTerm: 'Tours',
      rules: 'Les règles de chaque série',
      start: 'Commencer la séance {id}',
      supportFact:
        'Sur une jambe, bout des doigts au mur pour l’équilibre — jamais pour s’y appuyer.',
      tempoFact: 'Descente 2 s, montée 1 s, sans rebond : suis la figure.'
    },
    warmup: {
      circuit: 'Le circuit',
      name: 'Échauffement',
      nextDrill: 'Mouvement suivant',
      toCircuit: 'Au circuit'
    }
  },
  settings: {
    chosen: 'Choisi',
    data: {
      backup: 'Sauvegarde : exporter, importer',
      prose:
        'Chaque chiffre vit dans ce navigateur, sur cet appareil, et n’est envoyé nulle part. Un fichier de sauvegarde le porte sur un autre appareil.',
      title: 'Tes données'
    },
    device: 'Cet appareil',
    head: 'Réglages',
    install: {
      action: 'Installer l’app',
      apple:
        'Sur iPhone et iPad : Partager, puis « Sur l’écran d’accueil ». Elle s’ouvre alors en plein écran et tourne hors ligne.',
      installed: 'Installée sur cet appareil.',
      menu: 'Ce navigateur ne propose pas de bouton d’installation ici ; son menu peut contenir « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
      offered:
        'Installée, Séance s’ouvre depuis l’écran d’accueil, en plein écran, et tourne sans aucun réseau.',
      offlinePending: 'Enregistrement sur cet appareil…',
      offlineReady: 'Le manuel entier est sur cet appareil.',
      offlineTerm: 'Hors ligne',
      title: 'Installer'
    },
    language: {
      name: {
        en: 'English',
        fr: 'Français'
      },
      title: 'Langue'
    },
    numbers: 'Tes chiffres',
    protein: {
      hint: 'Environ 1,6 g par kilo de poids de corps, entre {min} et {max} g. La table compte vers elle.',
      invalid: 'Un nombre entier de grammes, entre {min} et {max}.',
      label: 'Grammes par jour',
      title: 'Cible de protéines'
    },
    reminders: {
      dayCell: {
        friday: 'Ve',
        monday: 'Lu',
        saturday: 'Sa',
        sunday: 'Di',
        thursday: 'Je',
        tuesday: 'Ma',
        wednesday: 'Me'
      },
      days: 'Jours',
      enable: 'Me rappeler la séance',
      permission: {
        default: 'Le navigateur demandera avant le premier rappel.',
        denied:
          'Les notifications sont bloquées pour ce site : autorise-les dans les réglages du site, dans le navigateur.',
        granted: 'Les notifications sont autorisées sur cet appareil.',
        unsupported: 'Ce navigateur ne sait pas afficher de notification.'
      },
      reach: {
        closedTerm: 'App fermée',
        none: 'Rien ne peut la réveiller : ce navigateur ne donne aucun réveil aux applis web, et Séance n’a pas de serveur pour en envoyer. Ouvre-la une fois dans la journée, et le rappel est tenu.',
        open: 'Le rappel arrive à l’heure, même dans un onglet en arrière-plan.',
        openTerm: 'App ouverte',
        periodic:
          'Le navigateur réveille l’app quelques fois par jour pour vérifier — près de l’heure, jamais à la minute.',
        periodicOnceInstalled:
          'Une fois installée, le navigateur réveille l’app quelques fois par jour pour vérifier — près de l’heure, jamais à la minute.',
        scheduled:
          'Ce navigateur prend les rappels à l’avance et les affiche app fermée.'
      },
      sendTest: 'Envoyer un essai',
      sound: 'Avec le son du système',
      test: {
        denied:
          'L’essai a été refusé : les notifications ne sont pas autorisées.',
        failed: 'L’essai n’a pas pu s’afficher.',
        sent: 'Essai envoyé.',
        unsupported: 'Ce navigateur ne sait pas en afficher.'
      },
      testBody: 'Voilà à quoi ressemble un rappel.',
      time: 'Heure',
      title: 'Rappels',
      weekday: defineTranslation('{day:date}', {
        date: { day: { weekday: 'long' } }
      })
    },
    theme: {
      dark: 'Sombre',
      light: 'Clair',
      system: 'Comme l’appareil',
      title: 'Impression'
    },
    wipe: {
      arm: 'Effacer les séances',
      cleared: 'Séances effacées.',
      confirm: 'Oui, tout effacer',
      confirmProse:
        'Séances notées sur cet appareil : {count}. Sans sauvegarde, elles ne reviendront pas.',
      empty: 'Aucune séance notée',
      prose:
        'Efface les séances notées et le test de pompes — pour des séances faites seulement pour essayer l’app. Les mesures, les réglages et la table restent.',
      title: 'Repartir de zéro'
    }
  },
  specimen: {
    band: 'des chiffres inventés.',
    leave: 'Mes chiffres',
    open: 'Ouvrir le spécimen',
    prose:
      'Un profil inventé — douze semaines de séances, de relevés et de jours comptés — pour voir chaque planche et chaque courbe pleines. Il vit à part : tes propres chiffres ne sont jamais lus ni touchés.',
    readingProse:
      'Tu lis le spécimen. Tout ce que tu fais ici y reste ; tes propres chiffres attendent, intacts.',
    reset: 'Le réimprimer',
    stamp: 'Spécimen',
    title: 'Spécimen'
  },
  table: {
    count: {
      add: 'Compter {name}, {portion}, {grams} grammes',
      firstCount: 'Premier compte. Il n’y a encore rien derrière lui.',
      head: 'Table · Le compte',
      met: 'Le compte est fait.',
      of: 'sur {target}',
      prior: 'Hier : <b>{yesterday} g</b>.',
      priorWithMean:
        'Hier : <b>{yesterday} g</b>. Moyenne des {days} derniers jours : <b>{mean} g</b>.',
      remove: 'Retirer une part de {name}',
      shareGrams: '{grams} g',
      short: 'Il manque <b>{grams} g</b>.',
      sourcesHint:
        'Une ligne, une part. La colonne de droite dit ce que la part apporte.',
      sourcesTitle: 'Ce qui compte',
      taps: '× {taps}',
      unit: 'g',
      why: '{target} g par jour. C’est la seule chose qui se compte : les protéines rassasient et tiennent le muscle pendant que le tour de taille descend. Aucune calorie à peser.',
      yield: '{grams} g'
    },
    date: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', weekday: 'long' } }
    }),
    grams: defineTranslation('{value:number}', {
      number: { value: { maximumFractionDigits: 1 } }
    }),
    market: {
      clear: 'Tout décocher',
      count: '<b>{done}</b> sur {total}',
      countDone: '<b>{done}</b> sur {total} — la liste est faite',
      head: 'Table · Les courses',
      prose:
        'Les mêmes chaque semaine : c’est la répétition qui rend le truc tenable, pas la variété. La liste se vide toute seule le vendredi.'
    },
    pot: {
      basesHint: 'Vingt minutes chacune, parce que la séance passe avant.',
      basesTitle: 'Les cinq bases',
      head: 'Table · La casserole',
      insideHint:
        '<b>{target} g</b> de protéines dans la casserole, pour en avoir 40 dans chaque portion.',
      insideTitle: 'Ce qu’il y a dedans',
      plateHint: 'Midi et soir, sans balance. La main suit le corps.',
      plateTitle: 'L’assiette',
      prose:
        'Cuire en quantité double le soir, manger la moitié, emporter l’autre le lendemain midi. Ce qui change, c’est ce qu’il y a dans la casserole.',
      shareDetail: ' — {detail}',
      title: 'Une casserole, deux repas.'
    },
    register: {
      count: 'Le compte',
      countNote: '{total} / {target}',
      market: 'Les courses',
      pot: 'La casserole',
      potBases: '5 bases'
    }
  }
})
