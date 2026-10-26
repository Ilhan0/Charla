/* Einheit 2 – Essen & Trinken (A1) */
Charla.addUnit({
  id: 'u2', title: 'Essen & Trinken', sub: 'Café, Restaurant, Zahlen, Markt', level: 'A1', emoji: '☕', color: '#F6C6B0',
  lessons: [
    {
      title: 'En el café', sub: 'Im Café bestellen', emoji: '☕',
      tip: ['Der, die, das: el, la, un, una',
        'Jedes Nomen im Spanischen ist männlich oder weiblich. Der Artikel zeigt es: el café (der Kaffee), la leche (die Milch). „Ein/eine“ heißt un (männlich) und una (weiblich): un café, una cerveza.\n\nAls Faustregel sind Wörter auf -o meist männlich und Wörter auf -a meist weiblich – es gibt aber viele Ausnahmen, deshalb lernst du die Wörter am besten immer mit Artikel. Das Wort agua (Wasser) ist weiblich, bekommt im Singular aber el: el agua.'],
      items: [
        ['un café', 'ein Kaffee', '!☕', 'Un café, por favor.', 'Einen Kaffee, bitte.'],
        ['un té', 'ein Tee', '!🍵', 'Un té con leche.', 'Einen Tee mit Milch.'],
        ['el agua', 'das Wasser', '!💧', 'Un vaso de agua, por favor.', 'Ein Glas Wasser, bitte.'],
        ['la leche', 'die Milch', '!🥛', 'Un café con leche.', 'Einen Milchkaffee.'],
        ['el zumo', 'der Saft', '!🧃', 'Un zumo de naranja.', 'Einen Orangensaft.'],
        ['la cerveza', 'das Bier', '!🍺', 'Una cerveza, por favor.', 'Ein Bier, bitte.'],
        ['Quisiera', 'Ich hätte gern', '💬', 'Quisiera un café, por favor.', 'Ich hätte gern einen Kaffee, bitte.'],
        ['con', 'mit', '➕', 'Quiero un té con leche.', 'Ich möchte einen Tee mit Milch.'],
        ['sin', 'ohne', '🚫', 'Un café sin leche.', 'Einen Kaffee ohne Milch.'],
        ['¿Qué desea?', 'Was darf es sein?', '🙋', '', ''],
        ['¿Algo más?', 'Sonst noch etwas?', '🤔', '', '']
      ],
      dialogue: ['Im Café', [
        ['Camarero', 'Buenas tardes. ¿Qué desea?', 'Guten Tag. Was darf es sein?'],
        ['Lucas', 'Quisiera un café con leche, por favor.', 'Ich hätte gern einen Milchkaffee, bitte.'],
        ['Camarero', '¿Algo más?', 'Sonst noch etwas?'],
        ['Lucas', 'Sí, un zumo, por favor.', 'Ja, einen Saft, bitte.'],
        ['Camarero', 'Muy bien.', 'Sehr gut.'],
        ['Lucas', 'Gracias.', 'Danke.']
      ]]
    },
    {
      title: 'En el restaurante', sub: 'Am Tisch bestellen', emoji: '🍽️',
      tip: ['Ich möchte: quiero und quisiera',
        'Quiero bedeutet „ich möchte“ oder „ich will“ und ist direkt. Quisiera heißt „ich hätte gern“ und klingt höflicher – im Restaurant und im Geschäft ist es die beste Wahl. Beide Formen gehören zum Verb querer.\n\nFür „Sie“ gibt es zwei Formen: usted für eine Person (¿Qué desea?) und ustedes für mehrere Personen (¿Qué desean?).'],
      items: [
        ['la carta', 'die Speisekarte', '📖', 'La carta, por favor.', 'Die Speisekarte, bitte.'],
        ['una mesa para dos', 'ein Tisch für zwei', '🍽️', 'Una mesa para dos, por favor.', 'Einen Tisch für zwei, bitte.'],
        ['la sopa', 'die Suppe', '!🍲', 'De primero, la sopa.', 'Als Vorspeise die Suppe.'],
        ['la ensalada', 'der Salat', '!🥗', 'Una ensalada, por favor.', 'Einen Salat, bitte.'],
        ['el pollo', 'das Hähnchen', '!🍗', 'Quiero el pollo.', 'Ich möchte das Hähnchen.'],
        ['el pescado', 'der Fisch', '!🐟', 'Quiero el pescado.', 'Ich möchte den Fisch.'],
        ['la carne', 'das Fleisch', '!🥩', 'Sin carne, por favor.', 'Ohne Fleisch, bitte.'],
        ['el pan', 'das Brot', '!🍞', 'Pan, por favor.', 'Brot, bitte.'],
        ['el vino', 'der Wein', '!🍷', 'Un vino, por favor.', 'Einen Wein, bitte.'],
        ['el helado', 'das Eis', '!🍦', 'De postre, un helado.', 'Als Nachtisch ein Eis.'],
        ['la cuenta', 'die Rechnung', '🧾', 'La cuenta, por favor.', 'Die Rechnung, bitte.']
      ],
      dialogue: ['Am Tisch', [
        ['Camarero', 'Buenas noches. ¿Una mesa para dos?', 'Guten Abend. Einen Tisch für zwei?'],
        ['Ana', 'Sí, por favor.', 'Ja, bitte.'],
        ['Camarero', '¿Qué desean?', 'Was möchten Sie?'],
        ['Ana', 'Quisiera la sopa y el pollo.', 'Ich hätte gern die Suppe und das Hähnchen.'],
        ['Lucas', 'Yo quiero la ensalada y el pescado.', 'Ich möchte den Salat und den Fisch.'],
        ['Camarero', 'Muy bien.', 'Sehr gut.']
      ]]
    },
    {
      title: 'Los números hasta 100', sub: 'Zahlen und Preise', emoji: '💶',
      tip: ['Zahlen ab 16',
        'Die Zahlen von 16 bis 29 schreibt man in einem Wort: dieciséis, diecisiete, veintiuno, veintidós … Ab 31 steht y („und“) dazwischen: treinta y uno, cuarenta y cinco, noventa y nueve. Anders als im Deutschen kommen erst die Zehner, dann die Einer: cuarenta y uno = „einundvierzig“.\n\n100 heißt cien. Vor weiteren Zahlen sagt man ciento: ciento veinte (120).'],
      items: [
        ['once', 'elf', '🔢', 'Once euros.', 'Elf Euro.'],
        ['quince', 'fünfzehn', '🔢', 'Quince euros, por favor.', 'Fünfzehn Euro, bitte.'],
        ['veinte', 'zwanzig', '🔢', 'Veinte euros.', 'Zwanzig Euro.'],
        ['treinta', 'dreißig', '🔢', 'Treinta euros, por favor.', 'Dreißig Euro, bitte.'],
        ['cuarenta', 'vierzig', '🔢', 'Cuarenta y cinco euros.', 'Fünfundvierzig Euro.'],
        ['cincuenta', 'fünfzig', '🔢', 'Cincuenta euros.', 'Fünfzig Euro.'],
        ['cien', 'hundert', '💯', 'Cien euros, por favor.', 'Hundert Euro, bitte.'],
        ['¿Cuánto cuesta?', 'Wie viel kostet das?', '💶', '¿Cuánto cuesta el pescado?', 'Wie viel kostet der Fisch?'],
        ['Son veinte euros', 'Das macht zwanzig Euro', '🧾', '', ''],
        ['caro', 'teuer', '💸', 'El vino es caro.', 'Der Wein ist teuer.', ['cara']],
        ['barato', 'billig / günstig', '🏷️', 'El pan es barato.', 'Das Brot ist günstig.', ['barata']]
      ],
      dialogue: ['Im Laden', [
        ['Lucas', '¿Cuánto cuesta el vino?', 'Wie viel kostet der Wein?'],
        ['Vendedora', 'Veinte euros.', 'Zwanzig Euro.'],
        ['Lucas', 'Es caro. ¿Y el pan?', 'Das ist teuer. Und das Brot?'],
        ['Vendedora', 'Un euro.', 'Einen Euro.'],
        ['Lucas', 'Es barato. Un pan, por favor.', 'Das ist günstig. Ein Brot, bitte.'],
        ['Vendedora', 'Muy bien. Un euro, por favor.', 'Gut. Einen Euro, bitte.']
      ]]
    },
    {
      title: 'En el mercado', sub: 'Obst und Gemüse kaufen', emoji: '🍎',
      tip: ['Der Plural: -s und -es',
        'Der Plural ist einfach: Endet ein Wort auf einen Vokal, hängst du -s an (manzana → manzanas, tomate → tomates). Endet es auf einen Konsonanten, kommt -es dazu (limón → limones, flor → flores). Der Artikel wird mit zum Plural: el tomate → los tomates, la fresa → las fresas.\n\nNach Mengenangaben steht de ohne Artikel: un kilo de manzanas, medio kilo de fresas.'],
      items: [
        ['la manzana', 'der Apfel', '!🍎', 'Un kilo de manzanas.', 'Ein Kilo Äpfel.'],
        ['la naranja', 'die Orange', '!🍊', 'Medio kilo de naranjas.', 'Ein halbes Kilo Orangen.'],
        ['el plátano', 'die Banane', '!🍌', 'Los plátanos son baratos.', 'Die Bananen sind günstig.'],
        ['la fresa', 'die Erdbeere', '!🍓', 'Quiero fresas, por favor.', 'Ich möchte Erdbeeren, bitte.'],
        ['el tomate', 'die Tomate', '!🍅', 'Un kilo de tomates.', 'Ein Kilo Tomaten.'],
        ['la patata', 'die Kartoffel', '!🥔', 'Dos kilos de patatas.', 'Zwei Kilo Kartoffeln.'],
        ['la zanahoria', 'die Karotte', '!🥕', 'Las zanahorias son baratas.', 'Die Karotten sind günstig.'],
        ['un kilo de', 'ein Kilo', '⚖️', 'Un kilo de manzanas, por favor.', 'Ein Kilo Äpfel, bitte.'],
        ['medio kilo de', 'ein halbes Kilo', '⚖️', 'Medio kilo de fresas.', 'Ein halbes Kilo Erdbeeren.'],
        ['Póngame', 'Geben Sie mir bitte', '🛒', 'Póngame un kilo de tomates.', 'Geben Sie mir bitte ein Kilo Tomaten.'],
        ['Aquí tiene', 'Bitte schön', '🤲', 'Aquí tiene, gracias.', 'Bitte schön, danke.']
      ],
      dialogue: ['Auf dem Markt', [
        ['Vendedor', 'Buenos días. ¿Qué desea?', 'Guten Morgen. Was darf es sein?'],
        ['Ana', 'Póngame un kilo de manzanas, por favor.', 'Geben Sie mir bitte ein Kilo Äpfel.'],
        ['Vendedor', 'Muy bien. ¿Algo más?', 'Gut. Sonst noch etwas?'],
        ['Ana', 'Sí, medio kilo de fresas.', 'Ja, ein halbes Kilo Erdbeeren.'],
        ['Vendedor', 'Son ocho euros.', 'Das macht acht Euro.'],
        ['Ana', 'Aquí tiene. Gracias.', 'Bitte schön. Danke.']
      ]]
    }
  ]
});
