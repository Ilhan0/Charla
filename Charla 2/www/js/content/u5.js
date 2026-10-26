/* Einheit 5 – Unterwegs (A1) */
Charla.addUnit({
  id: 'u5', title: 'Unterwegs', sub: 'Wegbeschreibung, Reisen, Hotel, Einkaufen', level: 'A1', emoji: '🧳', color: '#DEC6F0',
  lessons: [
    {
      title: '¿Dónde está …?', sub: 'Nach dem Weg fragen', emoji: '🧭',
      tip: ['estar: wo etwas ist',
        'Mit estar sagst du, wo sich etwas befindet: La estación está cerca. ¿Dónde está el banco? Für Eigenschaften, Herkunft und Berufe verwendest du dagegen ser: Soy alemán. El vino es caro.\n\nMerkhilfe: estar = Ort und Zustand, ser = Wesen und Herkunft. Beide Verben heißen „sein“, werden aber nicht vertauscht.'],
      items: [
        ['¿Dónde está …?', 'Wo ist …?', '🧭', '¿Dónde está la estación?', 'Wo ist der Bahnhof?'],
        ['a la derecha', 'rechts', '➡️', 'La farmacia está a la derecha.', 'Die Apotheke ist rechts.'],
        ['a la izquierda', 'links', '⬅️', 'El banco está a la izquierda.', 'Die Bank ist links.'],
        ['todo recto', 'geradeaus', '⬆️', 'Todo recto y a la derecha.', 'Geradeaus und dann rechts.'],
        ['cerca', 'nah / in der Nähe', '📍', 'El hotel está cerca.', 'Das Hotel ist in der Nähe.'],
        ['lejos', 'weit weg', '🏔️', 'La estación está lejos.', 'Der Bahnhof ist weit weg.'],
        ['la calle', 'die Straße', '🛣️', 'La calle es grande.', 'Die Straße ist groß.'],
        ['la plaza', 'der Platz', '⛲', 'La plaza está cerca.', 'Der Platz ist in der Nähe.'],
        ['la estación', 'der Bahnhof', '🚉', 'La estación está a la izquierda.', 'Der Bahnhof ist links.'],
        ['el banco', 'die Bank', '🏦', 'El banco está cerca.', 'Die Bank ist in der Nähe.'],
        ['la farmacia', 'die Apotheke', '💊', 'La farmacia está lejos.', 'Die Apotheke ist weit weg.']
      ],
      dialogue: ['Nach dem Weg fragen', [
        ['Lucas', 'Perdón, ¿dónde está la estación?', 'Entschuldigung, wo ist der Bahnhof?'],
        ['Señora', 'Todo recto y a la izquierda.', 'Geradeaus und dann links.'],
        ['Lucas', '¿Está lejos?', 'Ist es weit?'],
        ['Señora', 'No, está cerca.', 'Nein, es ist in der Nähe.'],
        ['Lucas', 'Muchas gracias.', 'Vielen Dank.'],
        ['Señora', 'De nada.', 'Gern geschehen.']
      ]]
    },
    {
      title: 'En el tren', sub: 'Verkehrsmittel und Tickets', emoji: '🚆',
      tip: ['Hin und zurück',
        'Eine Hin- und Rückfahrkarte heißt un billete de ida y vuelta, eine einfache Fahrt un billete de ida. Para bedeutet hier „nach/für“: un billete para Madrid. Mit a gibst du die Richtung an: Voy a Madrid (ich fahre nach Madrid).\n\nMit dem Verkehrsmittel sagst du en: Voy en tren, Voy en metro. Und: a + el wird zu al (Voy al banco), de + el wird zu del (la calle del banco).'],
      items: [
        ['el tren', 'der Zug', '!🚆', 'El tren sale a las diez.', 'Der Zug fährt um zehn Uhr ab.'],
        ['el autobús', 'der Bus', '!🚌', 'Voy en autobús.', 'Ich fahre mit dem Bus.'],
        ['el metro', 'die U-Bahn', '!🚇', 'Voy en metro.', 'Ich fahre mit der U-Bahn.'],
        ['el taxi', 'das Taxi', '!🚕', 'Un taxi, por favor.', 'Ein Taxi, bitte.'],
        ['el avión', 'das Flugzeug', '!✈️', 'Voy en avión.', 'Ich fliege.'],
        ['el billete', 'die Fahrkarte', '🎫', 'Un billete, por favor.', 'Eine Fahrkarte, bitte.'],
        ['ida y vuelta', 'hin und zurück', '🔁', 'Un billete de ida y vuelta.', 'Eine Fahrkarte hin und zurück.'],
        ['la parada', 'die Haltestelle', '🚏', 'La parada está cerca.', 'Die Haltestelle ist in der Nähe.'],
        ['Un billete para …', 'Eine Fahrkarte nach …', '🎟️', 'Un billete para Madrid, por favor.', 'Eine Fahrkarte nach Madrid, bitte.'],
        ['¿A qué hora sale el tren?', 'Wann fährt der Zug ab?', '⏰', '', ''],
        ['Voy a …', 'Ich fahre / gehe nach …', '🧳', 'Voy a Barcelona.', 'Ich fahre nach Barcelona.']
      ],
      dialogue: ['Am Fahrkartenschalter', [
        ['Lucas', 'Un billete para Madrid, por favor.', 'Eine Fahrkarte nach Madrid, bitte.'],
        ['Empleada', '¿Ida o ida y vuelta?', 'Einfach oder hin und zurück?'],
        ['Lucas', 'Ida y vuelta, por favor.', 'Hin und zurück, bitte.'],
        ['Empleada', 'Son treinta y cinco euros.', 'Das macht fünfunddreißig Euro.'],
        ['Lucas', '¿A qué hora sale el tren?', 'Wann fährt der Zug ab?'],
        ['Empleada', 'A las diez y media.', 'Um halb elf.']
      ]]
    },
    {
      title: 'En el hotel', sub: 'Einchecken und Zimmer', emoji: '🏨',
      tip: ['Es gibt: hay',
        'Hay bedeutet „es gibt“ und bleibt immer gleich: Hay una habitación. Hay dos camas. ¿Hay wifi? Nach hay steht meist ein unbestimmter Artikel (un/una) oder eine Zahl.\n\nWenn du nach etwas Bestimmtem fragst, nimmst du dagegen estar: ¿Dónde está la llave? – La llave está aquí. Auch hier gilt: hay für „es gibt irgendwo“, estar für „das bestimmte Ding befindet sich dort“.'],
      items: [
        ['el hotel', 'das Hotel', '🏨', 'El hotel está cerca.', 'Das Hotel ist in der Nähe.'],
        ['la habitación', 'das Zimmer', '🛏️', 'La habitación es grande.', 'Das Zimmer ist groß.'],
        ['una habitación doble', 'ein Doppelzimmer', '👫', 'Una habitación doble, por favor.', 'Ein Doppelzimmer, bitte.'],
        ['la reserva', 'die Reservierung', '📝', 'Tengo una reserva.', 'Ich habe eine Reservierung.'],
        ['la llave', 'der Schlüssel', '!🔑', 'Aquí tiene la llave.', 'Hier ist der Schlüssel.'],
        ['el desayuno', 'das Frühstück', '🥐', 'El desayuno es a las ocho.', 'Das Frühstück ist um acht Uhr.'],
        ['la noche', 'die Nacht', '🌙', 'Dos noches, por favor.', 'Zwei Nächte, bitte.'],
        ['el baño', 'das Badezimmer', '🚿', 'El baño es pequeño.', 'Das Bad ist klein.'],
        ['el wifi', 'das WLAN', '📶', '¿Hay wifi?', 'Gibt es WLAN?'],
        ['Hay', 'Es gibt', '☝️', 'Hay una habitación.', 'Es gibt ein Zimmer.'],
        ['¿Está incluido el desayuno?', 'Ist das Frühstück inklusive?', '❓', '', '']
      ],
      dialogue: ['An der Rezeption', [
        ['Lucas', 'Buenas tardes. Tengo una reserva.', 'Guten Tag. Ich habe eine Reservierung.'],
        ['Recepcionista', '¿Cómo se llama?', 'Wie heißen Sie?'],
        ['Lucas', 'Me llamo Lucas Weber.', 'Ich heiße Lucas Weber.'],
        ['Recepcionista', 'Una habitación doble para tres noches.', 'Ein Doppelzimmer für drei Nächte.'],
        ['Lucas', 'Sí. ¿Está incluido el desayuno?', 'Ja. Ist das Frühstück inklusive?'],
        ['Recepcionista', 'Sí. Aquí tiene la llave.', 'Ja. Hier ist der Schlüssel.']
      ]]
    },
    {
      title: 'De compras', sub: 'Kleidung und Farben', emoji: '👕',
      tip: ['Farben sind Adjektive',
        'Farben passen sich an das Nomen an: la camiseta roja, el vestido rojo, los zapatos negros. Bei Farben auf -e oder Konsonant bleibt die Form gleich: verde, azul. Die Farbe steht nach dem Nomen: una camiseta azul.\n\nAchtung: „Die Hose“ ist im Spanischen ein Plural: los pantalones. Deshalb heißt es auch Los pantalones son negros (mit son, nicht es).'],
      items: [
        ['la camiseta', 'das T-Shirt', '!👕', 'La camiseta es azul.', 'Das T-Shirt ist blau.'],
        ['los pantalones', 'die Hose', '!👖', 'Los pantalones son negros.', 'Die Hose ist schwarz.'],
        ['el vestido', 'das Kleid', '!👗', 'El vestido es rojo.', 'Das Kleid ist rot.'],
        ['los zapatos', 'die Schuhe', '!👞', 'Los zapatos son blancos.', 'Die Schuhe sind weiß.'],
        ['la chaqueta', 'die Jacke', '!🧥', 'La chaqueta es verde.', 'Die Jacke ist grün.'],
        ['rojo', 'rot', '🔴', 'El vestido es rojo.', 'Das Kleid ist rot.', ['roja']],
        ['azul', 'blau', '🔵', 'La camiseta es azul.', 'Das T-Shirt ist blau.'],
        ['verde', 'grün', '🟢', 'La chaqueta es verde.', 'Die Jacke ist grün.'],
        ['negro', 'schwarz', '⚫', 'Los pantalones son negros.', 'Die Hose ist schwarz.', ['negra']],
        ['blanco', 'weiß', '⚪', 'Los zapatos son blancos.', 'Die Schuhe sind weiß.', ['blanca']],
        ['Busco …', 'Ich suche …', '🔍', 'Busco una camiseta azul.', 'Ich suche ein blaues T-Shirt.']
      ],
      dialogue: ['Im Geschäft', [
        ['Vendedora', 'Buenos días. ¿Qué desea?', 'Guten Morgen. Was darf es sein?'],
        ['Ana', 'Busco una camiseta azul.', 'Ich suche ein blaues T-Shirt.'],
        ['Vendedora', 'Aquí tiene. Es muy bonita.', 'Bitte schön. Es ist sehr hübsch.'],
        ['Ana', '¿Cuánto cuesta?', 'Wie viel kostet es?'],
        ['Vendedora', 'Veinte euros.', 'Zwanzig Euro.'],
        ['Ana', 'Es barata. Quiero la camiseta.', 'Das ist günstig. Ich möchte das T-Shirt.']
      ]]
    }
  ]
});
