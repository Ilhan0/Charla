/* Einheit 1 – Erste Schritte (A1) */
Charla.addUnit({
  id: 'u1', title: 'Erste Schritte', sub: 'Begrüßen, vorstellen, zählen', level: 'A1', emoji: '👋', color: '#FFD9A0',
  lessons: [
    {
      title: 'Hola y adiós', sub: 'Begrüßen und verabschieden', emoji: '👋',
      tip: ['Das umgekehrte Fragezeichen',
        'Im Spanischen steht vor Fragen und Ausrufen ein umgedrehtes Zeichen: ¿Qué tal? ¡Hola! Das normale Zeichen folgt wie im Deutschen am Ende.\n\nBuenos días sagst du bis zum Mittag, buenas tardes vom Mittag bis zum Abend und buenas noches am Abend und nachts. Alle drei stehen im Plural – wörtlich heißt es „gute Tage“, „gute Nachmittage“ und „gute Nächte“.'],
      items: [
        ['Hola', 'Hallo', '👋', '¡Hola, Ana!', 'Hallo, Ana!'],
        ['Buenos días', 'Guten Morgen', '🌅', 'Buenos días, señor López.', 'Guten Morgen, Herr López.'],
        ['Buenas tardes', 'Guten Tag (ab mittags)', '🌇', 'Buenas tardes a todos.', 'Guten Tag, allerseits.'],
        ['Buenas noches', 'Guten Abend / Gute Nacht', '🌙', 'Buenas noches y hasta mañana.', 'Gute Nacht und bis morgen.'],
        ['¿Qué tal?', 'Wie geht’s?', '🙂', 'Hola, ¿qué tal?', 'Hallo, wie geht’s?'],
        ['Muy bien', 'Sehr gut', '😀', 'Muy bien, gracias.', 'Sehr gut, danke.'],
        ['Gracias', 'Danke', '🙏', 'Muchas gracias.', 'Vielen Dank.'],
        ['Por favor', 'Bitte', '🤲', 'Un café, por favor.', 'Einen Kaffee, bitte.'],
        ['De nada', 'Gern geschehen', '😊', 'Gracias. – De nada.', 'Danke. – Gern geschehen.'],
        ['Adiós', 'Tschüss', '🚶', 'Adiós, hasta luego.', 'Tschüss, bis später.'],
        ['Hasta luego', 'Bis später', '🕑', 'Hasta luego, Lucas.', 'Bis später, Lucas.']
      ],
      dialogue: ['Am Morgen', [
        ['Ana', '¡Hola! Buenos días.', 'Hallo! Guten Morgen.'],
        ['Lucas', 'Buenos días. ¿Qué tal?', 'Guten Morgen. Wie geht’s?'],
        ['Ana', 'Muy bien, gracias.', 'Sehr gut, danke.'],
        ['Lucas', 'Hasta luego, Ana.', 'Bis später, Ana.'],
        ['Ana', 'Adiós, Lucas.', 'Tschüss, Lucas.']
      ]]
    },
    {
      title: 'Me llamo …', sub: 'Sich vorstellen', emoji: '🙋',
      tip: ['Du oder Sie?',
        'Mit Freunden und Gleichaltrigen sagst du tú: ¿Cómo te llamas? Höflich und förmlich ist usted: ¿Cómo se llama usted?\n\nDas Pronomen yo (ich) lässt man meistens weg, weil die Verbform schon zeigt, wer gemeint ist: Soy Ana statt Yo soy Ana. Nur zur Betonung steht es dabei.\n\nLänder- und Städtenamen schreibt man wie im Deutschen groß. Sprachen und Nationalitäten schreibt man dagegen klein.'],
      items: [
        ['Me llamo', 'Ich heiße', '🙋', 'Me llamo Lucas.', 'Ich heiße Lucas.'],
        ['¿Cómo te llamas?', 'Wie heißt du?', '❓', 'Hola, ¿cómo te llamas?', 'Hallo, wie heißt du?'],
        ['Soy', 'Ich bin', '👤', 'Soy Ana.', 'Ich bin Ana.'],
        ['Mucho gusto', 'Freut mich', '🤝', 'Mucho gusto, Ana.', 'Freut mich, Ana.', ['Encantado', 'Encantada']],
        ['¿De dónde eres?', 'Woher kommst du?', '🌍', '¿De dónde eres, Lucas?', 'Woher kommst du, Lucas?'],
        ['Soy de', 'Ich komme aus', '📍', 'Soy de Hamburgo.', 'Ich komme aus Hamburg.'],
        ['Alemania', 'Deutschland', '!🇩🇪', 'Soy de Alemania.', 'Ich komme aus Deutschland.'],
        ['España', 'Spanien', '!🇪🇸', 'Ana es de España.', 'Ana kommt aus Spanien.'],
        ['Sí', 'Ja', '✅', 'Sí, soy Lucas.', 'Ja, ich bin Lucas.'],
        ['No', 'Nein', '❌', 'No, no soy de España.', 'Nein, ich komme nicht aus Spanien.'],
        ['¿Y tú?', 'Und du?', '💬', 'Soy de Alemania. ¿Y tú?', 'Ich komme aus Deutschland. Und du?']
      ],
      dialogue: ['Kennenlernen', [
        ['Ana', 'Hola, me llamo Ana. ¿Cómo te llamas?', 'Hallo, ich heiße Ana. Wie heißt du?'],
        ['Lucas', 'Me llamo Lucas. Mucho gusto.', 'Ich heiße Lucas. Freut mich.'],
        ['Ana', 'Mucho gusto. ¿De dónde eres?', 'Freut mich. Woher kommst du?'],
        ['Lucas', 'Soy de Alemania. ¿Y tú?', 'Ich komme aus Deutschland. Und du?'],
        ['Ana', 'Soy de España.', 'Ich komme aus Spanien.']
      ]]
    },
    {
      title: 'Los números', sub: 'Zahlen von 1 bis 10', emoji: '🔢',
      tip: ['Un oder una?',
        'Die Zahlen von 1 bis 10: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.\n\nVor einem Nomen wird uno zu un (männlich) oder una (weiblich): un café, una mesa. Beim bloßen Zählen sagst du uno, dos, tres.\n\nTelefonnummern nennt man meist Ziffer für Ziffer, so wie im Dialog.'],
      items: [
        ['uno', 'eins', '!1️⃣', 'Uno, dos, tres.', 'Eins, zwei, drei.'],
        ['dos', 'zwei', '!2️⃣', 'Dos cafés, por favor.', 'Zwei Kaffee, bitte.'],
        ['tres', 'drei', '!3️⃣', 'Tres y dos son cinco.', 'Drei und zwei sind fünf.'],
        ['cuatro', 'vier', '!4️⃣', 'Cuatro y cuatro son ocho.', 'Vier und vier sind acht.'],
        ['cinco', 'fünf', '!5️⃣', 'Cinco y cinco son diez.', 'Fünf und fünf sind zehn.'],
        ['seis', 'sechs', '!6️⃣', 'Seis y cuatro son diez.', 'Sechs und vier sind zehn.'],
        ['siete', 'sieben', '!7️⃣', 'Siete y tres son diez.', 'Sieben und drei sind zehn.'],
        ['ocho', 'acht', '!8️⃣', 'Ocho y uno son nueve.', 'Acht und eins sind neun.'],
        ['nueve', 'neun', '!9️⃣', 'Nueve y uno son diez.', 'Neun und eins sind zehn.'],
        ['diez', 'zehn', '!🔟', 'Diez euros, por favor.', 'Zehn Euro, bitte.'],
        ['Mi número es', 'Meine Nummer ist', '📱', 'Mi número es el seis, cinco, dos.', 'Meine Nummer ist die Sechs, Fünf, Zwei.'],
        ['¿Cuál es tu número?', 'Wie ist deine Nummer?', '☎️', '', '']
      ],
      dialogue: ['Nummern tauschen', [
        ['Ana', '¿Cuál es tu número?', 'Wie ist deine Nummer?'],
        ['Lucas', 'Mi número es el seis, uno, tres, ocho.', 'Meine Nummer ist die Sechs, Eins, Drei, Acht.'],
        ['Ana', 'Seis, uno, tres, ocho. ¡Gracias!', 'Sechs, eins, drei, acht. Danke!'],
        ['Lucas', 'De nada. Hasta luego.', 'Gern geschehen. Bis später.']
      ]]
    },
    {
      title: 'No entiendo', sub: 'Höflich nachfragen', emoji: '🤷',
      tip: ['Sie oder du?',
        'Fremden gegenüber (Verkäufer, Hotel, Behörde) benutzt du usted, die höfliche Form. Grammatisch verhält sie sich wie „er/sie“: ¿Habla alemán? bedeutet „Sprechen Sie Deutsch?“. Unter Freunden fragst du ¿Hablas alemán?\n\nWenn du etwas nicht verstehst, sind No entiendo und Más despacio, por favor deine besten Freunde. Sag sie ruhig oft – Spanier freuen sich, wenn du es versuchst.'],
      items: [
        ['Perdón', 'Entschuldigung', '🙇', 'Perdón, un momento.', 'Entschuldigung, einen Moment.'],
        ['Lo siento', 'Es tut mir leid', '😔', 'Lo siento mucho.', 'Es tut mir sehr leid.'],
        ['No entiendo', 'Ich verstehe nicht', '🤷', 'Lo siento, no entiendo.', 'Es tut mir leid, ich verstehe nicht.'],
        ['¿Puede repetir, por favor?', 'Können Sie das bitte wiederholen?', '🔁', 'Perdón, ¿puede repetir, por favor?', 'Entschuldigung, können Sie das bitte wiederholen?'],
        ['Más despacio, por favor', 'Langsamer, bitte', '🐢', 'No entiendo. Más despacio, por favor.', 'Ich verstehe nicht. Langsamer, bitte.'],
        ['¿Habla alemán?', 'Sprechen Sie Deutsch?', '🗣️', 'Perdón, ¿habla alemán?', 'Entschuldigung, sprechen Sie Deutsch?'],
        ['Hablo un poco de español', 'Ich spreche ein bisschen Spanisch', '🇪🇸', '', ''],
        ['Un momento', 'Einen Moment', '⏳', 'Un momento, por favor.', 'Einen Moment, bitte.'],
        ['Sí, claro', 'Ja, klar', '👌', 'Sí, claro. Un momento.', 'Ja, klar. Einen Moment.'],
        ['No hay problema', 'Kein Problem', '👍', 'No hay problema, gracias.', 'Kein Problem, danke.']
      ],
      dialogue: ['Auf der Straße', [
        ['Lucas', 'Perdón, ¿puede repetir, por favor?', 'Entschuldigung, können Sie das bitte wiederholen?'],
        ['Señora', 'Sí, claro. Más despacio.', 'Ja, klar. Langsamer.'],
        ['Lucas', 'Gracias. Hablo un poco de español.', 'Danke. Ich spreche ein bisschen Spanisch.'],
        ['Señora', 'No hay problema.', 'Kein Problem.']
      ]]
    }
  ]
});
