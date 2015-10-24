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
        List<Map<String, Object>> sqlResult =  repository.execute(sql);
        JSONObject result = new JSONObject();

        if (sqlResult == null || sqlResult.isEmpty())
        {
            return result;
        }

        Map<String, JSONArray> allSeries = new HashMap<>();

        for (Map<String, Object> cell : sqlResult)
        {
            Iterator<String> iter = cell.keySet().iterator();
            while (iter.hasNext())
            {
                String columnName = iter.next();
                if (allSeries.containsKey(columnName))
                {
                    allSeries.get(columnName).put(cell.get(columnName));
                }
                else
                {
                    JSONArray data = new JSONArray();
                    data.put(cell.get(columnName));
                    allSeries.put(columnName, data);
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
