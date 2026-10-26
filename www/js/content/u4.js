/* Einheit 4 – Alltag (A1) */
Charla.addUnit({
  id: 'u4', title: 'Alltag', sub: 'Uhrzeit, Wochentage, Tagesablauf, Hobbys', level: 'A1', emoji: '🕒', color: '#BBD8F2',
  lessons: [
    {
      title: 'La hora', sub: 'Die Uhrzeit', emoji: '🕒',
      tip: ['So sagst du die Uhrzeit',
        'Bei ein Uhr sagst du Es la una, bei allen anderen Stunden Son las dos, Son las tres … Nach der vollen Stunde kommen y (nach) und menos (vor): Son las tres y cuarto (3:15), Son las cuatro menos cuarto (3:45).\n\nAchtung bei „halb“: y media heißt „und halb“, also Stunde plus 30 Minuten. Son las ocho y media ist 8:30 Uhr – im Deutschen sagst du dazu „halb neun“.\n\n„Um … Uhr“ heißt a la una, a las dos: ¿A qué hora? – A las ocho.'],
      items: [
        ['¿Qué hora es?', 'Wie spät ist es?', '🕒', 'Perdón, ¿qué hora es?', 'Entschuldigung, wie spät ist es?'],
        ['Es la una', 'Es ist ein Uhr', '🕐', 'Es la una en punto.', 'Es ist genau ein Uhr.'],
        ['Son las dos', 'Es ist zwei Uhr', '🕑', 'Son las tres.', 'Es ist drei Uhr.'],
        ['en punto', 'genau / Punkt', '🎯', 'Son las ocho en punto.', 'Es ist genau acht Uhr.'],
        ['y cuarto', 'Viertel nach', '🕰️', 'Son las diez y cuarto.', 'Es ist Viertel nach zehn.'],
        ['y media', 'und halb (xx:30)', '🕧', 'Son las ocho y media.', 'Es ist halb neun.'],
        ['menos cuarto', 'Viertel vor', '🕰️', 'Son las nueve menos cuarto.', 'Es ist Viertel vor neun.'],
        ['de la mañana', 'morgens / vormittags', '🌅', 'Son las siete de la mañana.', 'Es ist sieben Uhr morgens.'],
        ['de la tarde', 'nachmittags', '🌇', 'Son las cuatro de la tarde.', 'Es ist vier Uhr nachmittags.'],
        ['de la noche', 'abends / nachts', '🌙', 'Son las once de la noche.', 'Es ist elf Uhr abends.'],
        ['¿A qué hora …?', 'Um wie viel Uhr …?', '⏰', '¿A qué hora es la clase?', 'Um wie viel Uhr ist der Unterricht?']
      ],
      dialogue: ['Nach der Uhrzeit fragen', [
        ['Ana', 'Perdón, ¿qué hora es?', 'Entschuldigung, wie spät ist es?'],
        ['Lucas', 'Son las ocho y media.', 'Es ist halb neun.'],
        ['Ana', '¿A qué hora es la clase?', 'Um wie viel Uhr ist der Unterricht?'],
        ['Lucas', 'A las nueve en punto.', 'Um Punkt neun Uhr.'],
        ['Ana', 'Muy bien. Hasta luego.', 'Sehr gut. Bis später.']
      ]]
    },
    {
      title: 'Los días', sub: 'Wochentage', emoji: '📅',
      tip: ['Wochentage',
        'Die Wochentage sind männlich und werden kleingeschrieben: el lunes, el martes … „Am Montag“ heißt el lunes, „montags“ los lunes. Die Woche beginnt im Spanischen mit dem Montag.\n\nmañana hat zwei Bedeutungen: „morgen“ (Hasta mañana) und „Vormittag“ (por la mañana). Hoy heißt „heute“ und ayer „gestern“.'],
      items: [
        ['lunes', 'Montag', '📅', 'El lunes trabajo.', 'Am Montag arbeite ich.'],
        ['martes', 'Dienstag', '📅', 'El martes no trabajo.', 'Am Dienstag arbeite ich nicht.'],
        ['miércoles', 'Mittwoch', '📅', 'Hoy es miércoles.', 'Heute ist Mittwoch.'],
        ['jueves', 'Donnerstag', '📅', 'Hoy es jueves.', 'Heute ist Donnerstag.'],
        ['viernes', 'Freitag', '📅', 'Mañana es viernes.', 'Morgen ist Freitag.'],
        ['sábado', 'Samstag', '📅', 'El sábado no trabajo.', 'Am Samstag arbeite ich nicht.'],
        ['domingo', 'Sonntag', '📅', 'El domingo hablo con mi familia.', 'Am Sonntag spreche ich mit meiner Familie.'],
        ['hoy', 'heute', '📆', 'Hoy es lunes.', 'Heute ist Montag.'],
        ['mañana', 'morgen', '➡️', 'Mañana es martes.', 'Morgen ist Dienstag.'],
        ['ayer', 'gestern', '⬅️', '', ''],
        ['¿Qué día es hoy?', 'Welcher Tag ist heute?', '❓', '', '']
      ],
      dialogue: ['Welcher Tag ist heute?', [
        ['Ana', '¿Qué día es hoy?', 'Welcher Tag ist heute?'],
        ['Lucas', 'Hoy es viernes.', 'Heute ist Freitag.'],
        ['Ana', '¡Qué bien! Mañana es sábado.', 'Wie schön! Morgen ist Samstag.'],
        ['Lucas', 'Sí, y el domingo no trabajo.', 'Ja, und am Sonntag arbeite ich nicht.']
      ]]
    },
    {
      title: 'Mi día', sub: 'Der Tagesablauf', emoji: '🌞',
      tip: ['Verben in der ich-Form',
        'Spanische Verben ändern ihre Endung je nach Person. In der ich-Form enden die meisten auf -o: desayuno, como, ceno, trabajo. Bei der du-Form wird daraus -as (bei Verben auf -ar) oder -es (bei Verben auf -er): cenas, comes.\n\nReflexive Verben haben ein Pronomen davor: me levanto (ich stehe auf), me acuesto (ich gehe schlafen). Bei du heißt es te levantas, te acuestas: ¿A qué hora te levantas?'],
      items: [
        ['Me levanto', 'Ich stehe auf', '⏰', 'Me levanto a las siete.', 'Ich stehe um sieben Uhr auf.'],
        ['Desayuno', 'Ich frühstücke', '🥐', 'Desayuno café y pan.', 'Ich frühstücke mit Kaffee und Brot.'],
        ['Voy al trabajo', 'Ich gehe zur Arbeit', '🚶', 'Voy al trabajo a las ocho.', 'Ich gehe um acht Uhr zur Arbeit.'],
        ['Como', 'Ich esse (zu Mittag)', '🍝', 'Como a las dos.', 'Ich esse um zwei Uhr zu Mittag.'],
        ['Ceno', 'Ich esse zu Abend', '🍽️', 'Ceno a las nueve.', 'Ich esse um neun Uhr zu Abend.'],
        ['Me acuesto', 'Ich gehe schlafen', '🛏️', 'Me acuesto a las once.', 'Ich gehe um elf Uhr schlafen.'],
        ['por la mañana', 'am Vormittag / morgens', '🌅', 'Trabajo por la mañana.', 'Ich arbeite am Vormittag.'],
        ['por la tarde', 'am Nachmittag', '🌇', 'Hablo español por la tarde.', 'Ich spreche nachmittags Spanisch.'],
        ['por la noche', 'am Abend / nachts', '🌙', 'Hablo con mi familia por la noche.', 'Abends spreche ich mit meiner Familie.'],
        ['siempre', 'immer', '♾️', 'Siempre desayuno café.', 'Ich frühstücke immer mit Kaffee.'],
        ['nunca', 'nie', '🚫', 'Nunca como carne.', 'Ich esse nie Fleisch.']
      ],
      dialogue: ['Ein normaler Tag', [
        ['Ana', '¿A qué hora te levantas?', 'Um wie viel Uhr stehst du auf?'],
        ['Lucas', 'Me levanto a las siete. Desayuno café y pan.', 'Ich stehe um sieben Uhr auf. Ich frühstücke mit Kaffee und Brot.'],
        ['Ana', 'Yo me levanto a las ocho.', 'Ich stehe um acht Uhr auf.'],
        ['Lucas', '¿A qué hora cenas?', 'Um wie viel Uhr isst du zu Abend?'],
        ['Ana', 'Ceno a las nueve.', 'Ich esse um neun Uhr zu Abend.']
      ]]
    },
    {
      title: 'Me gusta', sub: 'Hobbys und Vorlieben', emoji: '🎸',
      tip: ['gustar: „Es gefällt mir“',
        'Me gusta bedeutet wörtlich „Es gefällt mir“. Bei einem einzelnen Wort oder einem Verb sagst du me gusta: Me gusta la música, Me gusta bailar. Bei mehreren Dingen heißt es me gustan: Me gustan las películas.\n\nZur Verneinung steht no vor me: No me gusta el fútbol. Mit ¿Y a ti? fragst du „Und dir?“ und mit ¿Qué te gusta? „Was magst du?“.'],
      items: [
        ['Me gusta', 'Mir gefällt / Ich mag', '❤️', 'Me gusta el café.', 'Ich mag Kaffee.'],
        ['No me gusta', 'Mir gefällt nicht / Ich mag nicht', '💔', 'No me gusta la cerveza.', 'Ich mag kein Bier.'],
        ['¿Qué te gusta?', 'Was magst du?', '❓', '', ''],
        ['leer', 'lesen', '📖', 'Me gusta leer.', 'Ich lese gern.'],
        ['cocinar', 'kochen', '👩‍🍳', 'Me gusta cocinar.', 'Ich koche gern.'],
        ['bailar', 'tanzen', '💃', 'No me gusta bailar.', 'Ich tanze nicht gern.'],
        ['viajar', 'reisen', '🧳', 'Me gusta viajar.', 'Ich reise gern.'],
        ['nadar', 'schwimmen', '🏊', 'Me gusta nadar.', 'Ich schwimme gern.'],
        ['la música', 'die Musik', '!🎵', 'Me gusta la música.', 'Ich mag Musik.'],
        ['el fútbol', 'Fußball', '!⚽', 'Me gusta el fútbol.', 'Ich mag Fußball.'],
        ['las películas', 'die Filme', '🎬', 'Me gustan las películas.', 'Ich mag Filme.']
      ],
      dialogue: ['Hobbys', [
        ['Ana', '¿Qué te gusta, Lucas?', 'Was magst du, Lucas?'],
        ['Lucas', 'Me gusta el fútbol y viajar. ¿Y a ti?', 'Ich mag Fußball und reisen. Und du?'],
        ['Ana', 'Me gusta la música y bailar.', 'Ich mag Musik und tanzen.'],
        ['Lucas', 'No me gusta bailar.', 'Ich tanze nicht gern.'],
        ['Ana', 'Me gustan las películas.', 'Ich mag Filme.']
      ]]
    }
  ]
});
