import type { Setup } from '@/features/program/program-types'
import type { LocalizedText } from '@/helpers/localized-text'

const PUSH_UP_DOWN: LocalizedText = {
  en: 'Lower in 2 s, elbows at 45° from the body, until the chest is a fist from the floor.',
  fr: 'Descends en 2 s, coudes à 45° du corps, jusqu’à la poitrine à un poing du sol.'
}

const PUSH_UP_UP: LocalizedText = {
  en: 'Push the floor away in 1 s. No pause and no bounce at the bottom.',
  fr: 'Repousse le sol en 1 s. Ni pause ni rebond en bas.'
}

const PUSH_UP_BLOCK: LocalizedText = {
  en: 'Body braced in one block from ankles to head: glutes and abs tight.',
  fr: 'Corps gainé d’un bloc des chevilles à la tête : fessiers et abdos serrés.'
}

const SQUAT_STANCE: LocalizedText = {
  en: 'Feet shoulder-width apart, toes turned slightly out, arms straight ahead.',
  fr: 'Pieds largeur d’épaules, pointes légèrement ouvertes, bras tendus devant.'
}

const SQUAT_FORM: LocalizedText = {
  en: 'Heels on the floor, knees following the toes, chest high.',
  fr: 'Talons au sol, genoux dans l’axe des pieds, poitrine haute.'
}

export const CALF_RAISE_SETUP: Setup = [
  {
    en: 'Face the wall, 30 to 40 cm away, feet flat and hip-width apart. Fingertips on the wall at chest height.',
    fr: 'Face au mur, à 30–40 cm, pieds à plat largeur de hanches. Bout des doigts au mur, à hauteur de poitrine.'
  },
  {
    en: 'Rise straight up onto the balls of the feet, as high as they go, body vertical.',
    fr: 'Monte droit sur la pointe des pieds, le plus haut possible, corps vertical.'
  },
  {
    en: 'Hold 1 s at the top, then lower in 2 s until the heels touch the floor.',
    fr: 'Tiens 1 s en haut, puis redescends en 2 s jusqu’à poser les talons.'
  },
  {
    en: 'Never lean into the wall: the fingers keep the balance, they carry nothing. Too easy: one foot at a time.',
    fr: 'Ne te penche jamais vers le mur : les doigts gardent l’équilibre, ils ne portent rien. Trop facile : un pied à la fois.'
  }
]

export const HIP_THRUST_SETUP: Setup = [
  {
    en: 'On your back, knees bent, feet flat and hip-width apart, heels a hand’s length from the buttocks.',
    fr: 'Sur le dos, genoux pliés, pieds à plat largeur de hanches, talons à une main des fesses.'
  },
  {
    en: 'Arms on the floor along the body, palms down, chin tucked.',
    fr: 'Bras au sol le long du corps, paumes vers le sol, menton rentré.'
  },
  {
    en: 'Drive through the heels in 1 s up to the line shoulders–hips–knees, no higher. Squeeze the glutes for 1 s.',
    fr: 'Pousse dans les talons en 1 s jusqu’à la ligne épaules-hanches-genoux, pas plus haut. Serre les fessiers 1 s.'
  },
  {
    en: 'Lower in 2 s until the buttocks brush the floor, then go again without bouncing.',
    fr: 'Redescends en 2 s jusqu’à effleurer le sol, puis repars sans rebondir.'
  }
]

export const HIP_THRUST_SINGLE_SETUP: Setup = [
  {
    en: 'Start as for the hip thrust: on your back, the working foot flat, heel a hand’s length from the buttocks.',
    fr: 'Même départ que le hip thrust : sur le dos, pied d’appui à plat, talon à une main des fesses.'
  },
  {
    en: 'Straighten the other leg, in line with the working thigh.',
    fr: 'Tends l’autre jambe, dans l’axe de la cuisse d’appui.'
  },
  {
    en: 'Drive through the working heel in 1 s up to the line shoulders–hips–knee; hold 1 s, pelvis level.',
    fr: 'Pousse dans le talon d’appui en 1 s jusqu’à la ligne épaules-hanches-genou ; tiens 1 s, bassin horizontal.'
  },
  {
    en: 'Lower in 2 s. All the reps on one side, then the other.',
    fr: 'Redescends en 2 s. Toutes les répétitions d’un côté, puis l’autre.'
  }
]

export const HOLLOW_SETUP: Setup = [
  {
    en: 'On your back, press the lower back into the floor: a hand slipped under it no longer fits.',
    fr: 'Sur le dos, plaque le bas du dos au sol : une main glissée dessous ne doit plus passer.'
  },
  {
    en: 'Lift the shoulders and the legs, arms reaching toward the feet.',
    fr: 'Décolle les épaules et les jambes, bras tendus vers les pieds.'
  },
  {
    en: 'The lower the legs, the harder it is: start with the knees bent over the hips.',
    fr: 'Plus les jambes sont basses, plus c’est dur : commence genoux pliés au-dessus des hanches.'
  },
  {
    en: 'The moment the back arches, fold the knees in rather than carry on.',
    fr: 'Dès que le dos se creuse, replie les genoux plutôt que de continuer.'
  }
]

export const KNEE_MARCH_SETUP: Setup = [
  {
    en: 'Standing on the mat, feet hip-width apart.',
    fr: 'Debout sur le tapis, pieds largeur de hanches.'
  },
  {
    en: 'Lift one knee to hip height; the opposite arm swings forward.',
    fr: 'Monte un genou à hauteur de hanche ; le bras opposé part devant.'
  },
  {
    en: 'Put the foot down softly, then the other knee. A steady pace, no jumping.',
    fr: 'Repose le pied en douceur, puis l’autre genou. Rythme régulier, sans sauter.'
  },
  {
    en: 'Chest upright throughout: the knee comes up to the hip, the chest does not go down to the knee.',
    fr: 'Buste droit tout du long : le genou monte à la hanche, le buste ne descend pas vers le genou.'
  }
]

const LUNGE_STANCE: LocalizedText = {
  en: 'Standing, feet hip-width apart, hands on the hips — or fingertips on a wall beside you.',
  fr: 'Debout, pieds largeur de hanches, mains sur les hanches — ou bout des doigts au mur à côté de toi.'
}

const LUNGE_STEP: LocalizedText = {
  en: 'A long step back, onto the ball of the back foot.',
  fr: 'Un grand pas en arrière, sur la pointe du pied arrière.'
}

export const LUNGE_SETUP: Setup = [
  LUNGE_STANCE,
  LUNGE_STEP,
  {
    en: 'Lower in 2 s until the back knee is just above the floor. Hold 1 s there, without touching down.',
    fr: 'Descends en 2 s jusqu’au genou arrière juste au-dessus du sol. Tiens 1 s, sans le poser.'
  },
  {
    en: 'Push back up through the front heel in 1 s and bring the foot home. Alternate legs.',
    fr: 'Remonte en 1 s en poussant par le talon avant et ramène le pied. Alterne les jambes.'
  }
]

export const DYNAMIC_LUNGE_SETUP: Setup = [
  LUNGE_STANCE,
  LUNGE_STEP,
  {
    en: 'Lower until the back knee is just above the floor, no pause, then come back up.',
    fr: 'Descends jusqu’au genou arrière juste au-dessus du sol, sans pause, puis remonte.'
  },
  {
    en: 'Alternate legs, easy: this is waking the hips up, not the work yet.',
    fr: 'Alterne les jambes, tranquille : on réveille les hanches, ce n’est pas encore le travail.'
  }
]

export const MOUNTAIN_CLIMBER_SETUP: Setup = [
  {
    en: 'On the hands, under the shoulders, body in line as at the top of a push-up.',
    fr: 'En appui sur les mains, sous les épaules, corps en ligne comme en haut d’une pompe.'
  },
  {
    en: 'Bring one knee under the chest, put the foot back, then the other.',
    fr: 'Ramène un genou sous la poitrine, repose le pied, puis l’autre.'
  },
  {
    en: 'Hips low and still: they do not climb with every knee.',
    fr: 'Bassin bas et immobile : il ne monte pas à chaque genou.'
  },
  {
    en: 'Feet placed softly on the mat: no jumping.',
    fr: 'Pieds posés en douceur sur le tapis : pas de sauts.'
  }
]

export const PLANK_SETUP: Setup = [
  {
    en: 'Forearms on the floor, elbows under the shoulders.',
    fr: 'Avant-bras au sol, coudes sous les épaules.'
  },
  {
    en: 'On the toes, feet together or slightly apart.',
    fr: 'Sur la pointe des pieds, joints ou légèrement écartés.'
  },
  {
    en: 'One line from ankles to head: glutes tight, navel drawn in, eyes on the floor.',
    fr: 'Une ligne des chevilles à la tête : fessiers serrés, nombril rentré, regard vers le sol.'
  },
  {
    en: 'The moment the hips drop or rise, it is over: stop the clock.',
    fr: 'Dès que les hanches tombent ou montent, c’est fini : on arrête le chrono.'
  }
]

export const PUSH_UP_SETUP: Setup = [
  {
    en: 'Hands on the floor slightly wider than the shoulders, fingers forward.',
    fr: 'Mains au sol un peu plus larges que les épaules, doigts vers l’avant.'
  },
  PUSH_UP_BLOCK,
  PUSH_UP_DOWN,
  PUSH_UP_UP
]

export const PUSH_UP_FEET_RAISED_SETUP: Setup = [
  {
    en: 'Feet on a low, stable bench, hands on the floor under the shoulders.',
    fr: 'Pieds sur un banc bas et stable, mains au sol sous les épaules.'
  },
  PUSH_UP_BLOCK,
  PUSH_UP_DOWN,
  PUSH_UP_UP
]

export const PUSH_UP_INCLINE_SETUP: Setup = [
  {
    en: 'Hands on the edge of a sturdy low table — never anything on wheels. Walk the feet back until the body is in line.',
    fr: 'Mains sur le bord d’une table basse stable — jamais rien sur roulettes. Recule les pieds jusqu’au corps en ligne.'
  },
  PUSH_UP_BLOCK,
  {
    en: 'Lower in 2 s, elbows at 45° from the body, until the chest nears the edge.',
    fr: 'Descends en 2 s, coudes à 45° du corps, jusqu’à la poitrine près du bord.'
  },
  PUSH_UP_UP
]

export const PUSH_UP_INCLINE_HIGH_SETUP: Setup = [
  {
    en: 'Hands on the edge of a counter, shoulder-width apart. Walk the feet back until the body is in line.',
    fr: 'Mains sur le bord d’un plan de travail, largeur d’épaules. Recule les pieds jusqu’au corps en ligne.'
  },
  PUSH_UP_BLOCK,
  {
    en: 'Lower in 2 s, elbows at 45° from the body, until the chest nears the edge.',
    fr: 'Descends en 2 s, coudes à 45° du corps, jusqu’à la poitrine près du bord.'
  },
  PUSH_UP_UP
]

export const PUSH_UP_KNEES_SETUP: Setup = [
  {
    en: 'Knees on the mat, hands on the floor under the shoulders.',
    fr: 'Genoux sur le tapis, mains au sol sous les épaules.'
  },
  {
    en: 'One line from the knees to the head: no break at the hips.',
    fr: 'Une ligne des genoux à la tête : pas de cassure aux hanches.'
  },
  PUSH_UP_DOWN,
  PUSH_UP_UP
]

export const PUSH_UP_NARROW_SETUP: Setup = [
  {
    en: 'Hands on the floor right under the shoulders, shoulder-width apart: a hand’s width narrower than a normal push-up, never touching. Fingers pointing forward.',
    fr: 'Mains au sol juste sous les épaules, écartées de la largeur des épaules : une main plus serrées qu’une pompe normale, sans se toucher. Doigts vers l’avant.'
  },
  PUSH_UP_BLOCK,
  {
    en: 'Lower in 2 s, the elbows going back and brushing the ribs, until the chest is a fist from the floor — not resting on it.',
    fr: 'Descends en 2 s, les coudes partent vers l’arrière en frôlant les côtes, jusqu’à la poitrine à un poing du sol — sans la poser.'
  },
  PUSH_UP_UP
]

export const PUSH_UP_SLOW_SETUP: Setup = [
  {
    en: 'Hands on the floor slightly wider than the shoulders, fingers forward.',
    fr: 'Mains au sol un peu plus larges que les épaules, doigts vers l’avant.'
  },
  PUSH_UP_BLOCK,
  {
    en: 'Lower in 3 s, elbows at 45° from the body, and hold 1 s at the bottom.',
    fr: 'Descends en 3 s, coudes à 45° du corps, et tiens 1 s en bas.'
  },
  {
    en: 'Push back up in 1 s.',
    fr: 'Remonte en 1 s.'
  }
]

export const RDL_SINGLE_SETUP: Setup = [
  {
    en: 'Standing on one leg, knee slightly bent. Fingertips on a wall beside you if needed.',
    fr: 'Debout sur une jambe, genou légèrement fléchi. Bout des doigts au mur à côté de toi si besoin.'
  },
  {
    en: 'Tip the chest forward from the hip, back straight; the free leg swings back in line with the back.',
    fr: 'Bascule le buste depuis la hanche, dos droit ; la jambe libre part en arrière dans l’alignement du dos.'
  },
  {
    en: 'Lower in 2 s until the back of the thigh pulls — chest near level, no lower. No pause.',
    fr: 'Descends en 2 s jusqu’à sentir l’arrière de la cuisse tirer — buste près de l’horizontale, pas plus bas. Pas de pause.'
  },
  {
    en: 'Come up in 1 s, squeezing the standing glute. All the reps on one leg, then the other.',
    fr: 'Remonte en 1 s en serrant le fessier d’appui. Toutes les répétitions d’une jambe, puis l’autre.'
  }
]

export const ROW_DUMBBELL_SETUP: Setup = [
  {
    en: 'A light dumbbell in one hand, feet hip-width apart, knees soft.',
    fr: 'Un haltère léger dans une main, pieds largeur de hanches, genoux souples.'
  },
  {
    en: 'Lean the chest forward from the hips, back flat; the free hand rests on the thigh.',
    fr: 'Penche le buste depuis les hanches, dos plat ; la main libre se pose sur la cuisse.'
  },
  {
    en: 'Arm hanging under the shoulder, pull the elbow toward the hip in 1 s, close to the body.',
    fr: 'Bras pendant sous l’épaule, tire le coude vers la hanche en 1 s, près du corps.'
  },
  {
    en: 'Lower in 2 s to a straight arm, no pause. All the reps on one arm, then the other.',
    fr: 'Redescends en 2 s jusqu’au bras tendu, sans pause. Toutes les répétitions d’un bras, puis l’autre.'
  }
]

export const SHADOW_BOX_SETUP: Setup = [
  {
    en: 'Standing, one foot forward, knees soft, fists in front of the face.',
    fr: 'Debout, un pied devant, genoux souples, poings devant le visage.'
  },
  {
    en: 'Punch straight ahead, arm almost straight, then bring the fist back to the face.',
    fr: 'Frappe droit devant, bras presque tendu, puis ramène le poing au visage.'
  },
  {
    en: 'Alternate arms, never locking the elbow.',
    fr: 'Alterne les bras, sans jamais verrouiller le coude.'
  },
  {
    en: 'A pace at which you can still talk: this session stays easy.',
    fr: 'Une allure où tu peux encore parler : cette séance reste facile.'
  }
]

export const SIDE_PLANK_SETUP: Setup = [
  {
    en: 'On your side, elbow under the shoulder, forearm on the floor.',
    fr: 'Sur le côté, coude sous l’épaule, avant-bras au sol.'
  },
  {
    en: 'Legs straight and feet stacked — or knees bent on the floor to make it easier.',
    fr: 'Jambes tendues, pieds empilés — ou genoux pliés au sol pour faciliter.'
  },
  {
    en: 'Lift the hips: one line from ankles to head.',
    fr: 'Monte les hanches : une ligne des chevilles à la tête.'
  },
  {
    en: 'Hold, then switch sides when the plate says so.',
    fr: 'Tiens, puis change de côté quand la planche le dit.'
  }
]

export const SQUAT_SETUP: Setup = [
  SQUAT_STANCE,
  {
    en: 'Lower in 2 s, hips back as if to sit, thighs toward level.',
    fr: 'Descends en 2 s, hanches en arrière comme pour t’asseoir, cuisses vers l’horizontale.'
  },
  SQUAT_FORM,
  {
    en: 'Stand back up in 1 s, pushing the floor away. No pause and no bounce at the bottom.',
    fr: 'Remonte en 1 s en poussant le sol. Ni pause ni rebond en bas.'
  }
]

export const SQUAT_SLOW_SETUP: Setup = [
  SQUAT_STANCE,
  {
    en: 'Lower in 3 s, hips back as if to sit, as deep as stays comfortable.',
    fr: 'Descends en 3 s, hanches en arrière comme pour t’asseoir, aussi bas que ça reste confortable.'
  },
  SQUAT_FORM,
  {
    en: 'Stand back up in 1 s. No bounce at the bottom.',
    fr: 'Remonte en 1 s. Aucun rebond en bas.'
  }
]

export const YTW_SETUP: Setup = [
  {
    en: 'Face down on the mat, forehead resting on a folded towel, legs relaxed.',
    fr: 'À plat ventre sur le tapis, front posé sur une serviette pliée, jambes relâchées.'
  },
  {
    en: 'Y: arms straight, diagonally above the head. T: arms out to the sides, a little below shoulder height. W: elbows bent, drawn toward the ribs.',
    fr: 'Y : bras tendus en diagonale au-dessus de la tête. T : bras sur les côtés, un peu sous la hauteur des épaules. W : coudes pliés, ramenés vers les côtes.'
  },
  {
    en: 'In each letter, lift the arms off the floor in 1 s, hold 1 s, lower in 2 s. Thumbs to the ceiling.',
    fr: 'Dans chaque lettre, décolle les bras en 1 s, tiens 1 s, redescends en 2 s. Pouces vers le plafond.'
  },
  {
    en: 'Small is right: a few centimetres off the floor, the shoulder blades doing the lifting, never a pull into range.',
    fr: 'Petit, c’est juste : quelques centimètres, ce sont les omoplates qui soulèvent, jamais d’amplitude forcée.'
  }
]

export const HIP_CIRCLE_SETUP: Setup = [
  {
    en: 'Standing on one leg, fingertips on a wall beside you.',
    fr: 'Debout sur une jambe, bout des doigts au mur à côté de toi.'
  },
  {
    en: 'Lift the other knee to hip height.',
    fr: 'Monte l’autre genou à hauteur de hanche.'
  },
  {
    en: 'Draw a wide circle with the knee, slowly, the trunk still.',
    fr: 'Dessine un grand cercle avec le genou, lentement, buste immobile.'
  },
  {
    en: 'Ten circles, then the other leg.',
    fr: 'Dix cercles, puis l’autre jambe.'
  }
]

export const CAT_COW_SETUP: Setup = [
  {
    en: 'On all fours: hands under the shoulders, knees under the hips.',
    fr: 'À quatre pattes : mains sous les épaules, genoux sous les hanches.'
  },
  {
    en: 'Cow: let the belly drop and lift the head, breathing in.',
    fr: 'Vache : laisse descendre le ventre et relève la tête, en inspirant.'
  },
  {
    en: 'Cat: push the middle of the back up to the ceiling and tuck the head, breathing out.',
    fr: 'Chat : pousse le milieu du dos vers le plafond et rentre la tête, en soufflant.'
  },
  {
    en: 'Slowly, about 2 s in each position. Hands and knees never move.',
    fr: 'Lentement, environ 2 s par position. Mains et genoux ne bougent pas.'
  }
]

export const SLOW_AIR_SQUAT_SETUP: Setup = [
  SQUAT_STANCE,
  {
    en: 'Lower in 3 s, only as deep as stays comfortable: this opens the hips.',
    fr: 'Descends en 3 s, seulement aussi bas que c’est confortable : on ouvre les hanches.'
  },
  SQUAT_FORM,
  {
    en: 'Stand back up in 1 s.',
    fr: 'Remonte en 1 s.'
  }
]

export const ARM_CIRCLE_SETUP: Setup = [
  {
    en: 'Standing, one arm straight in front, shoulder low.',
    fr: 'Debout, un bras tendu devant, épaule basse.'
  },
  {
    en: 'Circle it, small first, then larger and larger.',
    fr: 'Fais des cercles, petits d’abord, puis de plus en plus grands.'
  },
  {
    en: 'The arm stays in the plane of the body, seen from the side — never spread out in a cross.',
    fr: 'Le bras reste dans le plan du corps, vu de profil — jamais écarté en croix.'
  },
  {
    en: 'Fifteen one way, fifteen the other, then the other arm.',
    fr: 'Quinze dans un sens, quinze dans l’autre, puis l’autre bras.'
  }
]

export const EXTERNAL_ROTATION_SETUP: Setup = [
  {
    en: 'Standing, elbows pinned to the ribs, bent at a right angle, forearms in front.',
    fr: 'Debout, coudes collés aux côtes, pliés à angle droit, avant-bras devant.'
  },
  {
    en: 'Open the forearms outward, elbows staying on the ribs, without forcing the end.',
    fr: 'Ouvre les avant-bras vers l’extérieur, coudes toujours collés, sans forcer la fin.'
  },
  {
    en: 'Come back to the front slowly.',
    fr: 'Reviens devant, lentement.'
  },
  {
    en: 'A rolled towel squeezed between elbow and ribs keeps the elbow from drifting.',
    fr: 'Une serviette roulée serrée entre coude et côtes empêche le coude de partir.'
  }
]

export const SCAPULAR_PUSH_UP_SETUP: Setup = [
  {
    en: 'At the top of a push-up — or on the knees — hands under the shoulders, arms straight.',
    fr: 'En haut d’une pompe — ou sur les genoux —, mains sous les épaules, bras tendus.'
  },
  {
    en: 'Let the chest sink between the shoulder blades, arms still straight.',
    fr: 'Laisse la poitrine descendre entre les omoplates, bras toujours tendus.'
  },
  {
    en: 'Push the floor away to spread the shoulder blades apart.',
    fr: 'Repousse le sol pour écarter les omoplates.'
  },
  {
    en: 'A small, slow movement: a few centimetres is the whole of it.',
    fr: 'Un petit mouvement, lent : quelques centimètres, c’est tout.'
  }
]

export const SHOULDER_CIRCLE_SETUP: Setup = [
  {
    en: 'Standing, fingertips resting on the shoulders.',
    fr: 'Debout, bout des doigts posés sur les épaules.'
  },
  {
    en: 'The elbows draw wide circles, slowly.',
    fr: 'Les coudes dessinent de grands cercles, lentement.'
  },
  {
    en: 'Ten forward, ten backward.',
    fr: 'Dix vers l’avant, dix vers l’arrière.'
  },
  {
    en: 'Shoulders kept away from the ears.',
    fr: 'Épaules loin des oreilles.'
  }
]

export const QUAD_STRETCH_SETUP: Setup = [
  {
    en: 'Stand beside a wall, one hand flat on it for balance.',
    fr: 'Debout à côté d’un mur, une main posée à plat dessus pour l’équilibre.'
  },
  {
    en: 'Bend the other knee and bring the heel up behind you toward the buttock. Catch that ankle with the hand on the same side.',
    fr: 'Plie l’autre genou et monte le talon derrière toi vers la fesse. Attrape cette cheville avec la main du même côté.'
  },
  {
    en: 'Knees side by side, the bent knee pointing at the floor. Tuck the pelvis under and push the hips slightly forward.',
    fr: 'Genoux côte à côte, le genou plié pointe vers le sol. Rentre le bassin et pousse les hanches légèrement en avant.'
  },
  {
    en: 'You feel it along the front of the thigh. A gentle pull, never a pain in the knee.',
    fr: 'Tu le sens sur le devant de la cuisse. Une traction douce, jamais de douleur au genou.'
  },
  {
    en: 'Breathe slowly. Let the foot down gently, then the other leg.',
    fr: 'Respire lentement. Repose le pied en douceur, puis l’autre jambe.'
  }
]

export const HAMSTRING_STRETCH_SETUP: Setup = [
  {
    en: 'Sit on the mat, one leg straight out in front, toes up. Fold the other leg, its sole against the inside of the straight thigh.',
    fr: 'Assis sur le tapis, une jambe tendue devant, orteils vers le haut. Plie l’autre jambe, plante du pied contre l’intérieur de la cuisse tendue.'
  },
  {
    en: 'Sit tall, then lean forward from the hips with the back long, the hands sliding down the leg.',
    fr: 'Grandis-toi, puis penche-toi depuis les hanches, dos long, les mains glissent le long de la jambe.'
  },
  {
    en: 'Stop as soon as it pulls behind the thigh. The knee may stay a little bent.',
    fr: 'Arrête-toi dès que ça tire derrière la cuisse. Le genou peut rester un peu fléchi.'
  },
  {
    en: 'Do not reach for the toes by rounding the back: a rounded back stretches nothing.',
    fr: 'Ne cherche pas les orteils en arrondissant le dos : un dos rond n’étire rien.'
  },
  {
    en: 'Breathe out slowly and let it go a little further on each breath, never bouncing.',
    fr: 'Souffle lentement et laisse aller un peu plus loin à chaque expiration, sans à-coups.'
  }
]

export const GLUTE_STRETCH_SETUP: Setup = [
  {
    en: 'Lie on your back, knees bent, feet flat on the floor.',
    fr: 'Allongé sur le dos, genoux pliés, pieds à plat au sol.'
  },
  {
    en: 'Cross one ankle over the other thigh, just above the knee, and let that knee open out to the side.',
    fr: 'Croise une cheville sur l’autre cuisse, juste au-dessus du genou, et laisse ce genou s’ouvrir vers l’extérieur.'
  },
  {
    en: 'Lift the foot still on the floor and hold that thigh from behind with both hands.',
    fr: 'Décolle le pied resté au sol et tiens cette cuisse par-derrière, à deux mains.'
  },
  {
    en: 'Draw the thigh gently toward the chest until you feel it deep in the buttock of the crossed leg.',
    fr: 'Ramène doucement la cuisse vers la poitrine jusqu’à sentir l’étirement au fond de la fesse de la jambe croisée.'
  },
  {
    en: 'Head and shoulders stay on the mat. Breathe slowly.',
    fr: 'Tête et épaules restent posées. Respire lentement.'
  }
]

export const PEC_DOOR_SETUP: Setup = [
  {
    en: 'Stand in a doorway, side-on to the frame.',
    fr: 'Debout dans l’encadrement d’une porte, de côté par rapport au montant.'
  },
  {
    en: 'Put the forearm flat against the frame, elbow bent, the elbow a hand lower than the shoulder — never level with it or above.',
    fr: 'Pose l’avant-bras à plat contre le montant, coude plié, le coude une main plus bas que l’épaule — jamais à sa hauteur ni au-dessus.'
  },
  {
    en: 'Take a small step forward with the leg on that side and let the chest come forward, without arching the lower back.',
    fr: 'Fais un petit pas en avant avec la jambe de ce côté et laisse la poitrine avancer, sans cambrer.'
  },
  {
    en: 'Stop at the first stretch across the front of the chest. Nothing should be felt inside the shoulder joint.',
    fr: 'Arrête-toi à la première sensation d’étirement sur le devant de la poitrine. Rien ne doit se sentir dans l’articulation de l’épaule.'
  },
  {
    en: 'Breathe slowly. Step back to come out.',
    fr: 'Respire lentement. Recule d’un pas pour sortir.'
  }
]

export const TRICEPS_STRETCH_SETUP: Setup = [
  {
    en: 'Stand or sit tall. Raise one arm straight up beside the ear, passing in front of you — never out to the side.',
    fr: 'Debout ou assis bien droit. Lève un bras tendu à côté de l’oreille, en passant par devant — jamais par le côté.'
  },
  {
    en: 'Bend that elbow: the hand drops behind the head, between the shoulder blades, and the elbow points at the ceiling.',
    fr: 'Plie ce coude : la main descend derrière la tête, entre les omoplates, et le coude pointe vers le plafond.'
  },
  {
    en: 'Bring the other hand over the top of the head and rest it on that elbow.',
    fr: 'Passe l’autre main par-dessus la tête et pose-la sur ce coude.'
  },
  {
    en: 'With that hand, guide the elbow gently a little back and down, until it pulls at the back of the upper arm.',
    fr: 'Avec cette main, guide doucement le coude un peu vers l’arrière et vers le bas, jusqu’à ce que ça tire à l’arrière du bras.'
  },
  {
    en: 'Light pressure: the hand guides, it does not push. Stop at the first pull; the shoulder itself feels nothing.',
    fr: 'Pression légère : la main guide, elle ne pousse pas. Arrête-toi à la première tension ; l’épaule elle-même ne sent rien.'
  },
  {
    en: 'Breathe slowly, ribs down, back not arched. Then lower the arm in front of you and do the other arm.',
    fr: 'Respire lentement, côtes basses, dos non cambré. Puis redescends le bras par devant et fais l’autre bras.'
  }
]

export const WRIST_STRETCH_SETUP: Setup = [
  {
    en: 'Standing or sitting, hold one arm straight out in front at shoulder height, elbow straight.',
    fr: 'Debout ou assis, tends un bras devant toi à hauteur d’épaule, coude tendu.'
  },
  {
    en: 'Turn the palm away from you, fingers pointing at the ceiling, as if signalling stop.',
    fr: 'Tourne la paume vers l’avant, doigts vers le plafond, comme pour faire signe de s’arrêter.'
  },
  {
    en: 'With the other hand, take the fingers and draw them gently back toward you.',
    fr: 'Avec l’autre main, prends les doigts et ramène-les doucement vers toi.'
  },
  {
    en: 'You feel it under the forearm, from the wrist toward the elbow. Gentle, never a pain in the wrist.',
    fr: 'Tu le sens sous l’avant-bras, du poignet vers le coude. Doux, jamais de douleur au poignet.'
  },
  {
    en: 'Breathe slowly. Halfway through, change wrists.',
    fr: 'Respire lentement. À mi-temps, change de poignet.'
  }
]

export const PIGEON_SETUP: Setup = [
  {
    en: 'Start on all fours. Bring one knee forward behind the hand on that side and lay the shin across the mat, foot toward the other hand.',
    fr: 'Pars à quatre pattes. Avance un genou derrière la main de ce côté et pose le tibia en travers du tapis, pied vers l’autre main.'
  },
  {
    en: 'Slide the other leg straight back, knee and top of the foot on the mat.',
    fr: 'Fais glisser l’autre jambe tendue vers l’arrière, genou et dessus du pied au sol.'
  },
  {
    en: 'Hips square to the front. If the front hip does not reach the floor, slide a cushion under it.',
    fr: 'Hanches face à l’avant. Si la hanche avant ne touche pas le sol, glisse un coussin dessous.'
  },
  {
    en: 'Upright on the hands first, then lower the chest over the front leg as far as is comfortable.',
    fr: 'D’abord droit sur les mains, puis descends le buste au-dessus de la jambe avant, aussi loin que c’est confortable.'
  },
  {
    en: 'You feel it deep in the buttock of the front leg. Nothing in the knee: if it does, bring the foot closer to you.',
    fr: 'Tu le sens au fond de la fesse de la jambe avant. Rien dans le genou : sinon, ramène le pied vers toi.'
  },
  {
    en: 'Long, slow breaths: each one out lets you sink a little.',
    fr: 'Respire longuement : chaque expiration te laisse descendre un peu.'
  }
]

export const THORACIC_WALL_SETUP: Setup = [
  {
    en: 'Stand side-on to a wall, an arm’s length away.',
    fr: 'Debout de côté à un mur, à une longueur de bras.'
  },
  {
    en: 'Put the hand flat on the wall slightly behind you, arm straight, the hand a little lower than the shoulder.',
    fr: 'Pose la main à plat au mur un peu derrière toi, bras tendu, la main un peu plus bas que l’épaule.'
  },
  {
    en: 'Feet still, slowly turn the chest and the head away from the wall.',
    fr: 'Pieds immobiles, tourne lentement la poitrine et la tête du côté opposé au mur.'
  },
  {
    en: 'Stop at the first stretch across the chest. Nothing deep in the shoulder joint.',
    fr: 'Arrête-toi à la première sensation d’étirement sur la poitrine. Rien au fond de l’articulation de l’épaule.'
  },
  {
    en: 'Breathe slowly. Turn back toward the wall to come out.',
    fr: 'Respire lentement. Reviens vers le mur pour sortir.'
  }
]

export const HIP_FLEXOR_LUNGE_SETUP: Setup = [
  {
    en: 'Kneel on one knee, the other foot flat in front, both knees at a right angle. A cushion under the back knee if needed.',
    fr: 'À genoux sur un genou, l’autre pied à plat devant, les deux genoux à angle droit. Un coussin sous le genou arrière si besoin.'
  },
  {
    en: 'Trunk upright, hands resting on the front thigh.',
    fr: 'Buste droit, mains posées sur la cuisse avant.'
  },
  {
    en: 'Tuck the pelvis under: glutes tight, belly button toward the ribs.',
    fr: 'Rentre le bassin : fessiers serrés, nombril vers les côtes.'
  },
  {
    en: 'Keeping that, shift the hips gently forward until it pulls at the front of the hip of the back leg.',
    fr: 'En gardant ça, avance doucement les hanches jusqu’à ce que ça tire à l’avant de la hanche de la jambe arrière.'
  },
  {
    en: 'The lower back stays flat and the front knee stays above the ankle. Breathe slowly.',
    fr: 'Le bas du dos reste plat et le genou avant reste au-dessus de la cheville. Respire lentement.'
  }
]

export const LAT_STRETCH_SETUP: Setup = [
  {
    en: 'Kneel, knees hip-width apart, hips above the knees.',
    fr: 'À genoux, genoux écartés de la largeur des hanches, hanches au-dessus des genoux.'
  },
  {
    en: 'Lean forward and walk the hands ahead along the floor until the arms are long and the chest sinks toward the floor.',
    fr: 'Penche-toi et avance les mains au sol devant toi jusqu’à ce que les bras soient allongés et que la poitrine descende vers le sol.'
  },
  {
    en: 'The hips stay above the knees: do not sit back on the heels.',
    fr: 'Les hanches restent au-dessus des genoux : ne t’assieds pas sur les talons.'
  },
  {
    en: 'Walk both hands toward the left: you feel it along the right flank, from the hip to the armpit. On the next plate, toward the right.',
    fr: 'Promène les deux mains vers la gauche : tu le sens le long du flanc droit, de la hanche à l’aisselle. À la planche suivante, vers la droite.'
  },
  {
    en: 'Let the chest sink and breathe into the stretched side.',
    fr: 'Laisse la poitrine descendre et respire dans le côté étiré.'
  }
]

export const NECK_STRETCH_SETUP: Setup = [
  {
    en: 'Stand or sit tall, shoulders low and relaxed.',
    fr: 'Debout ou assis bien droit, épaules basses et relâchées.'
  },
  {
    en: 'Lower the chin toward the chest.',
    fr: 'Descends le menton vers la poitrine.'
  },
  {
    en: 'Rest both hands on the back of the head, elbows pointing forward and close together — not spread wide.',
    fr: 'Pose les deux mains sur l’arrière du crâne, coudes pointés vers l’avant et rapprochés — pas écartés.'
  },
  {
    en: 'Let the weight of the hands do it, never pull. You feel it at the back of the neck, down between the shoulder blades.',
    fr: 'Laisse le poids des mains faire, ne tire jamais. Tu le sens à l’arrière de la nuque, jusqu’entre les omoplates.'
  },
  {
    en: 'Breathe slowly. Raise the head slowly to come out.',
    fr: 'Respire lentement. Relève la tête lentement pour sortir.'
  }
]
