/* Einheit 3 – Menschen & Beruf (A1) */
Charla.addUnit({
  id: 'u3', title: 'Menschen & Beruf', sub: 'Familie, Aussehen, Arbeit, Sprachen', level: 'A1', emoji: '👨‍👩‍👧', color: '#C6E3C0',
  lessons: [
    {
      title: 'Mi familia', sub: 'Familie und Verwandte', emoji: '👪',
      tip: ['Mein, dein: mi und tu',
        'Besitz drückst du mit mi (mein/meine) und tu (dein/deine) aus. Es gibt keinen Unterschied zwischen männlich und weiblich: mi padre, mi madre. Im Plural kommt ein -s dazu: mis hermanos, tus abuelos.\n\nTengo (ich habe) gehört zum Verb tener. Zur Verneinung stellst du einfach no davor: No tengo hermanos.'],
      items: [
        ['la familia', 'die Familie', '👪', 'Mi familia es de Alemania.', 'Meine Familie kommt aus Deutschland.'],
        ['la madre', 'die Mutter', '👩', 'Mi madre es de España.', 'Meine Mutter kommt aus Spanien.'],
        ['el padre', 'der Vater', '👨', 'Mi padre es de Alemania.', 'Mein Vater kommt aus Deutschland.'],
        ['el hermano', 'der Bruder', '👦', 'Tengo un hermano.', 'Ich habe einen Bruder.'],
        ['la hermana', 'die Schwester', '👧', 'Tengo una hermana.', 'Ich habe eine Schwester.'],
        ['el hijo', 'der Sohn', '🧒', 'Tengo un hijo.', 'Ich habe einen Sohn.'],
        ['la hija', 'die Tochter', '🎀', 'Tengo una hija.', 'Ich habe eine Tochter.'],
        ['el abuelo', 'der Großvater', '!👴', 'Mi abuelo es de Madrid.', 'Mein Großvater kommt aus Madrid.'],
        ['la abuela', 'die Großmutter', '!👵', 'Mi abuela es de Sevilla.', 'Meine Großmutter kommt aus Sevilla.'],
        ['Tengo', 'Ich habe', '🙌', 'Tengo dos hermanas.', 'Ich habe zwei Schwestern.'],
        ['¿Tienes hermanos?', 'Hast du Geschwister?', '❓', 'Sí, tengo una hermana.', 'Ja, ich habe eine Schwester.']
      ],
      dialogue: ['Über die Familie', [
        ['Ana', '¿Tienes hermanos?', 'Hast du Geschwister?'],
        ['Lucas', 'Sí, tengo un hermano y una hermana. ¿Y tú?', 'Ja, ich habe einen Bruder und eine Schwester. Und du?'],
        ['Ana', 'No, no tengo hermanos.', 'Nein, ich habe keine Geschwister.'],
        ['Lucas', 'Mi padre es de Alemania y mi madre es de España.', 'Mein Vater kommt aus Deutschland und meine Mutter aus Spanien.'],
        ['Ana', 'Mi familia es de Madrid.', 'Meine Familie kommt aus Madrid.']
      ]]
    },
    {
      title: '¿Cómo es?', sub: 'Menschen beschreiben', emoji: '🙂',
      tip: ['Adjektive passen sich an',
        'Adjektive richten sich nach dem Nomen. Aus -o wird -a, wenn das Wort weiblich ist: mi hermano es alto, mi hermana es alta. Adjektive auf -e (grande, verde) bleiben gleich, ebenso einige auf Konsonant wie joven, mayor oder azul. Nationalitäten auf Konsonant bekommen dagegen im Femininum ein -a: alemán – alemana. Im Plural kommt -s oder -es dazu: altos, jóvenes.\n\nDas Adjektiv steht meistens nach dem Nomen: un café grande (ein großer Kaffee). Das Alter gibst du mit tener an: Tiene veinte años – wörtlich „Er/Sie hat zwanzig Jahre“.'],
      items: [
        ['alto', 'groß', '📏', 'Mi padre es alto.', 'Mein Vater ist groß.', ['alta']],
        ['bajo', 'klein', '🤏', 'Mi hermana es baja.', 'Meine Schwester ist klein.', ['baja']],
        ['joven', 'jung', '🧑', 'Mi hermano es joven.', 'Mein Bruder ist jung.'],
        ['mayor', 'älter (Person)', '🧓', 'Mi abuelo es mayor.', 'Mein Großvater ist schon älter.'],
        ['simpático', 'sympathisch', '😊', 'Mi madre es simpática.', 'Meine Mutter ist sympathisch.', ['simpática']],
        ['guapo', 'hübsch', '😍', 'Tu hermana es guapa.', 'Deine Schwester ist hübsch.', ['guapa']],
        ['rubio', 'blond', '👱', 'Mi hermana es rubia.', 'Meine Schwester ist blond.', ['rubia']],
        ['moreno', 'dunkelhaarig', '🧔', 'Mi padre es moreno.', 'Mein Vater ist dunkelhaarig.', ['morena']],
        ['Él es', 'Er ist', '👨', 'Él es alto y simpático.', 'Er ist groß und sympathisch.'],
        ['Ella es', 'Sie ist', '👩', 'Ella es joven y guapa.', 'Sie ist jung und hübsch.'],
        ['Tiene veinte años', 'Er/Sie ist zwanzig Jahre alt', '🎂', 'Mi hermano tiene veinte años.', 'Mein Bruder ist zwanzig Jahre alt.']
      ],
      dialogue: ['Wer ist das?', [
        ['Lucas', 'Mi hermano es alto y simpático.', 'Mein Bruder ist groß und sympathisch.'],
        ['Ana', '¿Es joven?', 'Ist er jung?'],
        ['Lucas', 'Sí, tiene veinte años.', 'Ja, er ist zwanzig Jahre alt.'],
        ['Ana', '¿Y tu hermana?', 'Und deine Schwester?'],
        ['Lucas', 'Mi hermana es baja y rubia.', 'Meine Schwester ist klein und blond.'],
        ['Ana', '¡Qué bien! ¿Es simpática?', 'Wie schön! Ist sie sympathisch?'],
        ['Lucas', 'Sí, es muy simpática.', 'Ja, sie ist sehr sympathisch.']
      ]]
    },
    {
      title: 'Mi trabajo', sub: 'Berufe und Arbeit', emoji: '💼',
      tip: ['Berufe ohne Artikel',
        'Bei Berufen steht im Spanischen kein Artikel: Soy profesor, Soy médica. Viele Berufe haben eine männliche und eine weibliche Form: el profesor – la profesora, el médico – la médica. Bei Wörtern auf -nte oder -ista ändert sich nichts: el/la estudiante.\n\nTrabajo en … bedeutet „Ich arbeite in/bei …“: Trabajo en una oficina, Trabajo en Madrid.'],
      items: [
        ['¿A qué te dedicas?', 'Was machst du beruflich?', '💼', '', ''],
        ['Trabajo en', 'Ich arbeite in / bei', '🏢', 'Trabajo en Madrid.', 'Ich arbeite in Madrid.'],
        ['el profesor', 'der Lehrer', '👨‍🏫', 'Soy profesor.', 'Ich bin Lehrer.', ['la profesora']],
        ['el médico', 'der Arzt', '👨‍⚕️', 'Soy médico.', 'Ich bin Arzt.', ['la médica']],
        ['el ingeniero', 'der Ingenieur', '👷', 'Soy ingeniero.', 'Ich bin Ingenieur.', ['la ingeniera']],
        ['el estudiante', 'der Student', '🎓', 'Soy estudiante.', 'Ich bin Student.', ['la estudiante']],
        ['el camarero', 'der Kellner', '🍽️', 'Soy camarero.', 'Ich bin Kellner.', ['la camarera']],
        ['el cocinero', 'der Koch', '👨‍🍳', 'Soy cocinero.', 'Ich bin Koch.', ['la cocinera']],
        ['la oficina', 'das Büro', '🗂️', 'Trabajo en una oficina.', 'Ich arbeite in einem Büro.'],
        ['la empresa', 'die Firma', '🏭', 'Trabajo en una empresa.', 'Ich arbeite in einer Firma.'],
        ['el jefe', 'der Chef', '🕴️', 'Mi jefe es simpático.', 'Mein Chef ist sympathisch.', ['la jefa']]
      ],
      dialogue: ['Beim Kennenlernen', [
        ['Ana', '¿A qué te dedicas?', 'Was machst du beruflich?'],
        ['Lucas', 'Soy ingeniero. Trabajo en una empresa en Hamburgo.', 'Ich bin Ingenieur. Ich arbeite in einer Firma in Hamburg.'],
        ['Ana', 'Yo soy profesora. Trabajo en Madrid.', 'Ich bin Lehrerin. Ich arbeite in Madrid.'],
        ['Lucas', '¿Tu jefe es simpático?', 'Ist dein Chef sympathisch?'],
        ['Ana', 'Sí, mi jefe es muy simpático.', 'Ja, mein Chef ist sehr sympathisch.']
      ]]
    },
    {
      title: 'Idiomas', sub: 'Sprachen und Nationalitäten', emoji: '🗣️',
      tip: ['Sprachen schreibt man klein',
        'Sprachen und Nationalitäten werden im Spanischen kleingeschrieben: el español, soy alemán. Eigennamen von Ländern und Städten schreibst du dagegen groß: Alemania, Madrid.\n\nNach hablar und aprender lässt man den Artikel weg: Hablo español. Aprendo alemán. Nationalitäten richten sich nach dem Geschlecht: Soy alemán (Mann) – soy alemana (Frau).'],
      items: [
        ['el español', 'Spanisch', '🇪🇸', 'Hablo español.', 'Ich spreche Spanisch.'],
        ['el alemán', 'Deutsch', '🇩🇪', 'Hablo alemán.', 'Ich spreche Deutsch.'],
        ['el inglés', 'Englisch', '🇬🇧', 'Hablo inglés.', 'Ich spreche Englisch.'],
        ['el francés', 'Französisch', '🇫🇷', 'Hablo un poco de francés.', 'Ich spreche ein bisschen Französisch.'],
        ['Hablo', 'Ich spreche', '🗣️', 'Hablo español y alemán.', 'Ich spreche Spanisch und Deutsch.'],
        ['¿Hablas inglés?', 'Sprichst du Englisch?', '❓', 'Sí, hablo inglés.', 'Ja, ich spreche Englisch.'],
        ['Soy alemán', 'Ich bin Deutscher', '🧑', 'Soy alemán, de Hamburgo.', 'Ich bin Deutscher, aus Hamburg.', ['Soy alemana']],
        ['Soy español', 'Ich bin Spanier', '🧑', 'Soy español, de Sevilla.', 'Ich bin Spanier, aus Sevilla.', ['Soy española']],
        ['un poco', 'ein bisschen', '🤏', 'Hablo un poco.', 'Ich spreche ein bisschen.'],
        ['bastante bien', 'ziemlich gut', '👍', 'Hablas bastante bien.', 'Du sprichst ziemlich gut.'],
        ['Aprendo español', 'Ich lerne Spanisch', '📚', '', '']
      ],
      dialogue: ['Sprachen', [
        ['Ana', '¿Hablas inglés?', 'Sprichst du Englisch?'],
        ['Lucas', 'Sí, hablo inglés y alemán. Y aprendo español.', 'Ja, ich spreche Englisch und Deutsch. Und ich lerne Spanisch.'],
        ['Ana', '¡Muy bien! Hablas bastante bien.', 'Sehr gut! Du sprichst ziemlich gut.'],
        ['Lucas', 'Gracias. Hablo un poco.', 'Danke. Ich spreche ein bisschen.']
      ]]
    }
  ]
});
