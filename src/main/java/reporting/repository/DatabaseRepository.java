package reporting.repository;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DatabaseRepository implements IDatabaseRepository
{
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List execute(String sql)
    {
        return sessionFactory.getCurrentSession()
                .createSQLQuery(sql)
                .list();
    }

    public SessionFactory getSessionFactory()
        {
            return sessionFactory;
        }

    public void setSessionFactory(SessionFactory sessionFactory)
        {
            this.sessionFactory = sessionFactory;
        }
}
