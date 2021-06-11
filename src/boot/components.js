import FacetContainer from '@/components/search/facets/FacetContainer'
import MultilingualText from '@/components/i18n/MultilingualText'
import BaseInput from '@/components/widgets/forms/BaseInput'
import BaseSelect from '@/components/widgets/forms/BaseSelect'
import MultilingualInput from '@/components/widgets/forms/MultilingualInput'
import LocaleSelect from '@/components/widgets/forms/LocaleSelect'
import MultilingualEditor from '@/components/widgets/forms/MultilingualEditor'
import ChipsSelect from '@/components/widgets/forms/ChipsSelect'
import MultilingualEditorList from '@/components/widgets/forms/MultilingualEditorList'
import SchemaSelect from '@/components/widgets/forms/SchemaSelect'
import IdentifierInput from '@/components/widgets/forms/IdentifierInput'
import IdentifierInputList from '@/components/widgets/forms/IdentifierInputList'
import AuthorInput from '@/components/widgets/forms/AuthorInput'
import DateInput from '@/components/widgets/forms/DateInput'
import CircularSpinner from '@/components/widgets/progress/CircularSpinner'
import CreateRecordBtn from '@/components/widgets/button/CreateRecordBtn'
import NestedFacet from '@/components/search/facets/NestedFacet'
import TermSelect from '@/components/widgets/forms/TermSelect'

export default {
    install (app) {
        app.component('create-record-btn', CreateRecordBtn)
        app.component('base-input', BaseInput)
        app.component('date-input', DateInput)
        app.component('identifier-input', IdentifierInput)
        app.component('author-input', AuthorInput)
        app.component('identifier-input-list', IdentifierInputList)
        app.component('multilingual-input', MultilingualInput)
        app.component('multilingual-editor', MultilingualEditor)
        app.component('multilingual-editor-list', MultilingualEditorList)
        app.component('locale-select', LocaleSelect)
        app.component('chips-select', ChipsSelect)
        app.component('base-select', BaseSelect)
        app.component('term-select', TermSelect)
        app.component('schema-select', SchemaSelect)
        app.component('facet-container', FacetContainer)
        app.component('nested-facet', NestedFacet)
        app.component('circular-spinner', CircularSpinner)
        app.component('mt', MultilingualText)
    }
}
