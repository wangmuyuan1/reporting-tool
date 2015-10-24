package reporting.service;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reporting.repository.IDatabaseRepository;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class QueryService implements IQueryService
{
    @Autowired
    IDatabaseRepository repository;

    @Override
    public JSONObject execute(String sql)
    {
        List results =  repository.execute(sql);
        JSONObject result = new JSONObject();

        if (results == null || results.isEmpty())
        {
            return result;
        }

        Map<String, JSONArray> allSeries = new HashMap<>();

        for (Map<String, Object> cell : results)
        {
            Iterator<String> iter = cell.keySet().iterator();
            while (iter.hasNext())
            {
                String columnName = iter.next();
                if (allSeries.keySet().contains(columnName))
                {
                    allSeries.get(columnName).
                }
            }
        }

        try
        {
            result.put("series", allSeries);
        }
        catch (JSONException e)
        {
            e.printStackTrace();
        }

        return result;
    }
}
