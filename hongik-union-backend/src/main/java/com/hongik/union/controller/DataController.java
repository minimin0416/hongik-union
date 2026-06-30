package com.hongik.union.controller;

import com.hongik.union.service.RedisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/data")
public class DataController {

    private final RedisService redisService;

    public DataController(RedisService redisService) {
        this.redisService = redisService;
    }

    // GET /api/data?key=hn_notices
    @GetMapping
    public ResponseEntity<String> get(@RequestParam String key) {
        String value = redisService.get(key);
        return ResponseEntity.ok(value);
    }

    // POST /api/data  { "key": "hn_notices", "value": "..." }
    @PostMapping
    public ResponseEntity<Map<String, Boolean>> set(@RequestBody Map<String, String> body) {
        redisService.set(body.get("key"), body.get("value"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // DELETE /api/data
    @DeleteMapping
    public ResponseEntity<Map<String, Boolean>> flushDb() {
        redisService.flushDb();
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
