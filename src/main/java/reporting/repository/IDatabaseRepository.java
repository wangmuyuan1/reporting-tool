package reporting.repository;

import java.util.List;

public interface IDatabaseRepository
{
    List execute(String sql);
}
