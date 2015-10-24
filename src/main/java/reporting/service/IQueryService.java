package reporting.service;

import org.json.JSONObject;

public interface IQueryService
{
    JSONObject execute(String sql);
}
