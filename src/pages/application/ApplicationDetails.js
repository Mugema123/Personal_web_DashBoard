import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useFetcher } from 'src/api/fetcher';
import DataWidget from 'src/components/widgets/DataWidget';
import CompanyDetails from './details/CompanyDetails';
import IndividualDetails from './details/IndividualDetails';
import { connect } from 'react-redux';

const ApplicationDetails = ({ currentUser }) => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFetcher(
    `/api/applications/${id}`,
  );
  const application = data?.data || {};
  const isCompany = application?.category === 'company';

  return (
    <>
      <Helmet>
        <title> Application Details | MUGEMA Admin</title>
      </Helmet>

      <DataWidget
        title={'Application details'}
        isLoading={isLoading}
        isError={isError}
      >
        {isCompany ? (
          <CompanyDetails
            application={application}
            currentUser={currentUser}
          />
        ) : (
          <IndividualDetails
            application={application}
            currentUser={currentUser}
          />
        )}
      </DataWidget>
    </>
  );
};

const mapStateToProps = state => ({
  currentUser: state.auth.isAuthenticated.currentUser,
});

export default connect(mapStateToProps)(ApplicationDetails);
