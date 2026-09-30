import type { FigureId } from '@/features/program/program-types'
import type { LocalizedText } from '@/helpers/localized-text'

/** What the drawing says, for whoever cannot see it. */
export const FIGURE_LABELS: Record<FigureId, LocalizedText> = {
  'arm-circle': {
    en: 'Standing figure in profile, one straight arm drawing a full circle around the shoulder.',
    fr: 'Silhouette debout de profil, bras tendu qui décrit un cercle complet autour de l’épaule.'
  },
  'calf-raise': {
    en: 'Detail of a leg standing on the flat floor, up on the ball of the foot, heel lifted.',
    fr: 'Détail d’une jambe debout sur le sol plat, sur la pointe du pied, talon décollé.'
  },
  'cat-cow': {
    en: 'Figure on all fours, hands and knees on the floor, the back rounding up to the ceiling with the head tucked, then hollowing with the head raised.',
    fr: 'Silhouette à quatre pattes, mains et genoux au sol, le dos qui s’arrondit vers le plafond tête rentrée, puis se creuse tête relevée.'
  },
  'external-rotation': {
    en: 'Standing figure seen from the front, elbows pinned to the ribs and bent at a right angle, forearms opening outward.',
    fr: 'Silhouette debout de face, coudes collés aux côtes et pliés à angle droit, avant-bras qui s’ouvrent vers l’extérieur.'
  },
  'glute-stretch': {
    en: 'Figure lying on the back, one ankle crossed over the opposite thigh, both hands drawing that thigh toward the chest.',
    fr: 'Silhouette sur le dos, une cheville croisée sur la cuisse opposée, les deux mains tirant cette cuisse vers la poitrine.'
  },
  'hamstring-stretch': {
    en: 'Figure sitting on the floor, one leg straight ahead, chest leaning toward the foot, the other leg folded.',
    fr: 'Silhouette assise au sol, une jambe tendue devant, buste penché vers le pied, l’autre jambe repliée.'
  },
  'hip-circle': {
    en: 'Standing figure in profile on one leg, the other knee raised and drawing a circle.',
    fr: 'Silhouette debout de profil sur une jambe, genou de l’autre jambe levé qui décrit un cercle.'
  },
  'hip-flexor-lunge': {
    en: 'Figure in a lunge with the back knee on the floor, front foot flat, chest upright over the hips.',
    fr: 'Silhouette en fente genou arrière au sol, pied avant à plat, buste droit au-dessus des hanches.'
  },
  'hip-thrust': {
    en: 'Figure lying on the back, shoulders on the floor, hips lifted until shoulders, hips and knees form one straight line, knees bent at a right angle.',
    fr: 'Silhouette sur le dos, épaules au sol, bassin soulevé jusqu’à la ligne droite épaules-hanches-genoux, genoux pliés à angle droit.'
  },
  'hip-thrust-single': {
    en: 'Figure lying on the back, hips lifted on a single leg, the other straight in the air.',
    fr: 'Silhouette sur le dos, bassin soulevé sur une seule jambe, l’autre tendue en l’air.'
  },
  hollow: {
    en: 'Figure lying on the back, shoulders and legs lifted off the floor, arms straight behind the head.',
    fr: 'Silhouette sur le dos, épaules et jambes décollées du sol, bras tendus derrière la tête.'
  },
  'knee-march': {
    en: 'Standing figure in profile marching on the spot, one knee raised to hip height, the opposite arm forward.',
    fr: 'Silhouette debout de profil qui marche sur place, un genou levé à hauteur de hanche, le bras opposé devant.'
  },
  'lat-stretch': {
    en: 'Kneeling figure, hips kept over the knees, chest lowered toward the floor, arms long in front.',
    fr: 'Silhouette à genoux, hanches restées au-dessus des genoux, poitrine descendue vers le sol, bras allongés devant.'
  },
  'lunge-back': {
    en: 'Figure in profile: reverse lunge, front knee bent, back knee lowered close to the floor.',
    fr: 'Silhouette de profil : fente arrière, genou avant fléchi, genou arrière descendu près du sol.'
  },
  'mountain-climber': {
    en: 'Figure on the hands, one leg straight behind, the other knee drawn under the chest.',
    fr: 'Silhouette en appui sur les mains, une jambe tendue en arrière, l’autre genou ramené sous la poitrine.'
  },
  'neck-stretch': {
    en: 'Standing figure in profile, chin drawn toward the chest, hands resting on the back of the head.',
    fr: 'Silhouette debout de profil, menton ramené vers la poitrine, mains posées sur l’arrière du crâne.'
  },
  'pec-door': {
    en: 'Standing figure in profile at a doorframe, forearm flat against the jamb, chest turned forward.',
    fr: 'Silhouette debout de profil devant un chambranle de porte, avant-bras posé à plat contre le montant, buste tourné vers l’avant.'
  },
  pigeon: {
    en: 'Figure on the floor, front shin folded under the body, back leg long behind, chest leaning forward, hands down.',
    fr: 'Silhouette au sol, tibia avant replié sous le corps, jambe arrière allongée derrière, buste penché vers l’avant, mains au sol.'
  },
  plank: {
    en: 'Figure in profile: forearm plank, body in a straight line from ankles to shoulders.',
    fr: 'Silhouette de profil : planche sur les avant-bras, corps en ligne droite des chevilles aux épaules.'
  },
  'push-up': {
    en: 'Figure in profile: push-up, hands on the floor, body braced in a straight line.',
    fr: 'Silhouette de profil : pompes, mains au sol, corps gainé en ligne droite.'
  },
  'push-up-feet-raised': {
    en: 'Figure in profile: push-up with the feet raised on a bench, body sloping down.',
    fr: 'Silhouette de profil : pompes pieds surélevés sur un banc, corps en ligne descendante.'
  },
  'push-up-incline': {
    en: 'Figure in profile: incline push-up, hands on a raised support, body in line.',
    fr: 'Silhouette de profil : pompes inclinées, mains sur un appui haut, corps en ligne.'
  },
  'push-up-knees': {
    en: 'Figure in profile: knee push-up, knees on the floor, hips in line with the back.',
    fr: 'Silhouette de profil : pompes sur les genoux, genoux au sol, hanches dans l’axe du dos.'
  },
  'push-up-narrow': {
    en: 'Figure in profile: close-grip push-up at the bottom, elbows tight against the ribs.',
    fr: 'Silhouette de profil : pompes mains serrées en position basse, coudes serrés contre le buste.'
  },
  'quad-stretch': {
    en: 'Standing figure in profile on one leg, the other heel drawn to the glutes, the hand holding the ankle.',
    fr: 'Silhouette debout de profil sur une jambe, l’autre talon ramené à la fesse, la main tenant la cheville.'
  },
  'rdl-single': {
    en: 'Figure balanced on one leg, chest level, the free leg straight behind.',
    fr: 'Silhouette en équilibre sur une jambe, buste à l’horizontale, jambe libre tendue en arrière.'
  },
  'row-dumbbell': {
    en: 'Figure bent over with a flat back, the free hand on the thigh, the other elbow pulling a dumbbell up toward the hip.',
    fr: 'Silhouette penchée dos plat, main libre sur la cuisse, l’autre coude qui tire un haltère vers la hanche.'
  },
  'scapular-push-up': {
    en: 'Figure in profile on the hands, arms straight, chest sinking between the shoulders and pushing back up.',
    fr: 'Silhouette de profil en appui sur les mains, bras tendus, poitrine qui s’enfonce entre les épaules puis se repousse.'
  },
  'shadow-box': {
    en: 'Figure in a boxing guard, one arm straight ahead, the other folded near the face.',
    fr: 'Silhouette en garde de boxe, un bras tendu devant, l’autre replié près du visage.'
  },
  'shoulder-roll': {
    en: 'Standing figure in profile, fingertips on the shoulder, the elbow drawing a circle.',
    fr: 'Silhouette debout de profil, doigts posés sur l’épaule, coude qui décrit un cercle.'
  },
  'side-plank': {
    en: 'Figure in profile: side plank on one elbow, the top arm reaching to the ceiling.',
    fr: 'Silhouette de profil : gainage latéral en appui sur un coude, bras du dessus tendu vers le plafond.'
  },
  squat: {
    en: 'Figure in profile: squat at the bottom, heels down, arms straight ahead.',
    fr: 'Silhouette de profil : squat en position basse, talons au sol, bras tendus devant.'
  },
  'thoracic-wall': {
    en: 'Standing figure in profile by a wall, one arm straight behind at shoulder height, hand on the wall, chest turned away.',
    fr: 'Silhouette debout de profil contre un mur, un bras tendu en arrière à hauteur d’épaule, main posée au mur, buste tourné du côté opposé.'
  },
  'triceps-stretch': {
    en: 'Standing figure seen from the front, one elbow raised beside the head and the hand dropped down the back, the other hand on that elbow.',
    fr: 'Silhouette debout de face, un coude levé à côté de la tête et la main descendue dans le dos, l’autre main posée sur ce coude.'
  },
  walk: {
    en: 'Figure in profile walking briskly, long stride, arms swinging.',
    fr: 'Silhouette de profil en marche rapide, foulée ample, bras en balancier.'
  },
  'wrist-stretch': {
    en: 'Standing figure in profile, one arm straight ahead, the other hand catching that hand and drawing it back.',
    fr: 'Silhouette debout de profil, un bras tendu devant, l’autre main attrapant cette main pour la ramener en arrière.'
  },
  ytw: {
    en: 'Figure lying face down, chest and arms lifted off the floor, arms straight ahead in a Y.',
    fr: 'Silhouette à plat ventre, poitrine et bras décollés du sol, bras tendus en avant en Y.'
  }
}
