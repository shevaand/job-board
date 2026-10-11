import { SelectItem } from '@/components/ui/select'
import { countryOptions } from '../lib/countries'

export function CountrySelectItems() {
	return countryOptions.map(country => (
		<SelectItem key={country.code} value={country.code}>
			{country.name}
		</SelectItem>
	))
}
