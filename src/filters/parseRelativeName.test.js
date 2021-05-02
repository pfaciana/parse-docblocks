const parseRelativeName = require('./parseRelativeName');
const {trimName} = parseRelativeName;

const table = [
	// Constants
	[{name: 'WP_CONTENT_DIR'}, {type: 'constant', name: {namespace: [], name: 'WP_CONTENT_DIR'}}],
	[{name: 'WC'}, {type: 'constant', name: {namespace: [], name: 'WC'}}],
	[{name: 'ABC::SOME_CONST'}, {type: 'constant', name: {namespace: [], name: ['ABC', 'SOME_CONST']}}],
	[{name: 'ABC\\Def\\Ghi::SOME_CONST'}, {type: 'constant', name: {namespace: ['ABC', 'Def'], name: ['Ghi', 'SOME_CONST']}}],
	[{name: 'ABC\\Def\\ghi::XYZ'}, {type: 'constant', name: {namespace: ['ABC', 'Def'], name: ['ghi', 'XYZ']}}],
	// Variables
	[{name: '$wpdb'}, {type: 'variable', name: {namespace: [], name: 'wpdb'}}],
	[{name: '$plain_search'}, {type: 'variable', name: {namespace: [], name: 'plain_search'}}],
	// Functions
	[{name: 'memcache'}, {type: 'function', name: {namespace: [], name: 'memcache'}}],
	[{name: 'do_action()'}, {type: 'function', name: {namespace: [], name: 'do_action'}}],
	[{name: '_n()'}, {type: 'function', name: {namespace: [], name: '_n'}}],
	[{name: 'WC()'}, {type: 'function', name: {namespace: [], name: 'WC'}}],
	[{name: 'wp_parse_args'}, {type: 'function', name: {namespace: [], name: 'wp_parse_args'}}],
	[{name: 'ABC\\Def\\ghi\\wp_parse_args()'}, {type: 'function', name: {namespace: ['ABC', 'Def', 'ghi'], name: 'wp_parse_args'}}],
	// Classes
	[{name: 'Memcache'}, {type: 'class', name: {namespace: [], name: 'Memcache'}}],
	[{name: 'Plugin_basename'}, {type: 'class', name: {namespace: [], name: 'Plugin_basename'}}],
	[{name: 'WC_Cart_Totals'}, {type: 'class', name: {namespace: [], name: 'WC_Cart_Totals'}}],
	[{name: 'ABC\\Def\\ghi\\xyz'}, {type: 'class', name: {namespace: ['ABC', 'Def', 'ghi'], name: 'xyz'}}],
	[{name: 'ABC\\Def\\ghi\\XYZ'}, {type: 'class', name: {namespace: ['ABC', 'Def', 'ghi'], name: 'XYZ'}}],
	// Properties
	[{name: 'ABC::$_registered_addons'}, {type: 'property', name: {namespace: [], name: ['ABC', '_registered_addons']}}],
	[{name: 'wpdb::$field_types'}, {type: 'property', name: {namespace: [], name: ['wpdb', 'field_types']}}],
	[{name: '$wpdb::$field_types'}, {type: 'property', name: {namespace: [], name: ['wpdb', 'field_types']}}],
	[{name: '$wpdb->$field_types'}, {type: 'property', name: {namespace: [], name: ['wpdb', 'field_types']}}],
	[{name: 'someclass::$extra_field'}, {type: 'property', name: {namespace: [], name: ['someclass', 'extra_field']}}],
	[{name: 'ABC\\Def\\ghi\\someclass::$extra_field'}, {type: 'property', name: {namespace: ['ABC', 'Def', 'ghi'], name: ['someclass', 'extra_field']}}],
	// Methods
	[{name: 'ABC\\Def\\Ghi::xyz'}, {type: 'method', name: {namespace: ['ABC', 'Def'], name: ['Ghi', 'xyz']}}],
	[{name: 'ABC\\Def\\Ghi::xyz()'}, {type: 'method', name: {namespace: ['ABC', 'Def'], name: ['Ghi', 'xyz']}}],
	[{name: 'ABC\\Def\\Ghi::$xyz()'}, {type: 'method', name: {namespace: ['ABC', 'Def'], name: ['Ghi', 'xyz']}}],
	[{name: 'ABC::add_entry()'}, {type: 'method', name: {namespace: [], name: ['ABC', 'add_entry']}}],
	[{name: 'ABC::get_lead_table_name'}, {type: 'method', name: {namespace: [], name: ['ABC', 'get_lead_table_name']}}],
	[{name: 'ABC::get_meta_table_name()'}, {type: 'method', name: {namespace: [], name: ['ABC', 'get_meta_table_name']}}],
	[{name: 'WC_Logger::log'}, {type: 'method', name: {namespace: [], name: ['WC_Logger', 'log']}}],
	[{name: 'WP_List_Table::__construct()'}, {type: 'method', name: {namespace: [], name: ['WP_List_Table', '__construct']}}],
	[{name: 'ABC\\Def\\Ghi->insert_load_css()'}, {type: 'method', name: {namespace: ['ABC', 'Def'], name: ['Ghi', 'insert_load_css']}}],
	[{name: 'self::init()'}, {type: 'method', name: {namespace: [], name: ['self', 'init']}}],
	[{name: '$wpdb->init()'}, {type: 'method', name: {namespace: [], name: ['wpdb', 'init']}}],
	[{name: '$wpdb->init'}, {type: 'method', name: {namespace: [], name: ['wpdb', 'init']}}],
	[{name: '$wpdb->$init()'}, {type: 'method', name: {namespace: [], name: ['wpdb', 'init']}}],
	[{name: '$this->some_method'}, {type: 'method', name: {namespace: [], name: ['this', 'some_method']}}],
	// No parsing
	[{name: 'Some sentence.'}],
	[{name: '$this->property->method()'}],
];

test.each(table)('%s',
	(obj, expected = obj) => {
		const origObj = {...obj};
		expect(parseRelativeName(obj)).toStrictEqual(expected);
		if (obj !== expected) {
			origObj.name = '\\' + origObj.name;
			expect(parseRelativeName(origObj)).toStrictEqual(expected);
		}
	},
);

const trimTable = [
	['abc123'],
	['\\abc123', 'abc123'],
	['$abc123', 'abc123'],
	['\\$abc123', 'abc123'],
	['abc123()', 'abc123'],
	['\\abc123()', 'abc123'],
	['$abc123()', 'abc123'],
	['\\$abc123()', 'abc123'],
	['Ab\\Cd', 'Ab\\Cd'],
	['\\Ab\\Cd', 'Ab\\Cd'],
	['\\Ab\\$cd', 'Ab\\$cd'],
];

test.each(trimTable)('%s',
	(input, expected = input) => {
		expect(trimName(input)).toStrictEqual(expected);
	},
);