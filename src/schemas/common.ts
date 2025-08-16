import S from 'fluent-json-schema';

const commonSchema = {
	id: S.integer()
		.minimum(1)
		.maximum(2147483648),
	email: S.string()
		.format('email'),
	date: S.string()
		.format('date'),
	datetime: S.string()
		.format('date-time'),
} as const;

export default commonSchema;