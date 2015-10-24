package reporting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import reporting.service.IQueryService;

@Controller
public class QueryController
{
    @Autowired
    private IQueryService service;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    @ResponseBody
    public String Query(@RequestParam("sql") String sql)
    {
        return service.execute(sql.replaceAll(";", "")).toString();
    }
}
