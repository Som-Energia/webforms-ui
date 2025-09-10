import GurbRequirementsFinishSuccessful from './GurbRequirementsFinishSuccessful'
import GurbRequirementsFinishWithoutContract from './GurbRequirementsFinishWithoutContract'


const GurbRequirementsFinish = (props) => {
    const { values } = props

    return (
      <>
        {values.new_contract === false ? (
          <GurbRequirementsFinishSuccessful {...props} />
        ) : (
          <GurbRequirementsFinishWithoutContract {...props} />
        )}
      </>
    )
}
export default GurbRequirementsFinish