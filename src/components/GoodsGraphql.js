import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Loading from './Loading'

const GET_GOODS = gql`
query goods {
  goods {
    id
    name
    shelf
  }
}
`

const Goods = props => (
  <Query query={GET_GOODS}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <p>ERROR {error.toString()}</p>;

      return (
        <React.Fragment>
      {data.goods &&
        data.goods.map(good => (
          <p key={good.id}>
            {good.name}
          </p>
        ))
      }
      </React.Fragment>
      );
    }}
  </Query>
)

export default Goods;
