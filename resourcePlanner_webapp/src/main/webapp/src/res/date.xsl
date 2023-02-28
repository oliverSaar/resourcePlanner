<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- DateTime zu Date Formatieren (MM dd yyyy)-->
    <xsl:template name="format-to-date">
        <xsl:param name="iso-datetime"/>
        
        <xsl:variable name="date">
            <xsl:call-template name="adjust-to-timezone">
                <xsl:with-param name="datetime" select="$iso-datetime"/>
            </xsl:call-template>
        </xsl:variable>
        
        <xsl:variable name="year" select="substring($date, 1, 4)"/>
        <xsl:variable name="month" select="substring($date, 6, 2)"/>
        <xsl:variable name="day" select="substring($date, 9, 2)"/>
        <xsl:value-of select="concat($day, '.',$month, '.', $year)"/>
    </xsl:template>
    
    <!-- DateTime zu Zeit formatieren (HH:mm) -->
    <xsl:template name="format-to-time">
        <xsl:param name="iso-datetime"/>
        
        <xsl:variable name="date">
            <xsl:call-template name="adjust-to-timezone">
                <xsl:with-param name="datetime" select="$iso-datetime"/>
            </xsl:call-template>
        </xsl:variable>
        
        <xsl:variable name="hour" select="substring($date, 12, 2)"/>
        <xsl:variable name="minute" select="substring($date, 15, 2)"/>
        <xsl:value-of select="concat($hour,':',$minute)"/>
    </xsl:template>
    
    <!-- Add weeks to datetime -->
    <xsl:template name="datetime-add-weeks">
        <xsl:param name="datetime"/>
        <xsl:param name="weeks"/>

        <xsl:variable name="seconds">
            <xsl:call-template name="datetime-to-seconds">
                <xsl:with-param name="datetime" select="$datetime"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:call-template name="seconds-to-datetime">
            <xsl:with-param name="total-seconds" select="$seconds + $weeks * 604800"/>
        </xsl:call-template>
    </xsl:template>
    
    <!-- Timezone offset -->
    <xsl:template name="adjust-to-timezone">
        <xsl:param name="datetime"/>
        <!-- Standard time adjustment -->
        <xsl:param name="hours" select="2"/>
        
        <xsl:variable name="datetime-to-seconds">
            <xsl:call-template name="datetime-to-seconds">
                <xsl:with-param name="datetime" select="$datetime"/>
            </xsl:call-template>
        </xsl:variable> 
        
        <xsl:variable name="total-seconds" select="$datetime-to-seconds + 3600 * $hours" />
        
        <xsl:call-template name="seconds-to-datetime">
            <xsl:with-param name="total-seconds" select="$total-seconds"/>
        </xsl:call-template>
    </xsl:template>
    
    <!-- Seconds to Datetime -->
    <xsl:template name="seconds-to-datetime">
        <xsl:param name="total-seconds"/>
        
        <!-- new date -->
        <xsl:variable name="new-date">
            <xsl:call-template name="datetime-to-gregorian">
                <xsl:with-param name="datetime" select="floor($total-seconds div 86400)"/>
            </xsl:call-template>
        </xsl:variable> 
        <!-- new time -->
        <xsl:variable name="t" select="$total-seconds mod 86400" />
        <xsl:variable name="h" select="floor($t div 3600)" />
        <xsl:variable name="r" select="$t mod 3600"/>
        <xsl:variable name="m" select="floor($r div 60)"/>
        <xsl:variable name="s" select="$r mod 60"/>
        <!-- output -->
        <xsl:value-of select="$new-date" />
        <xsl:text>T</xsl:text>
        <xsl:value-of select="format-number($h, '00')"/>
        <xsl:value-of select="format-number($m, ':00')"/>
        <xsl:value-of select="format-number($s, ':00.000')"/>
        <xsl:text>Z</xsl:text>
    </xsl:template>
    
    <!-- Datetime to seconds -->
    <xsl:template name="datetime-to-seconds">
        <xsl:param name="datetime"/>
        
        <xsl:variable name="date" select="substring-before($datetime, 'T')" />
        <xsl:variable name="time" select="substring-after($datetime, 'T')" />
        
        <xsl:variable name="year" select="substring($date, 1, 4)" />
        <xsl:variable name="month" select="substring($date, 6, 2)" />
        <xsl:variable name="day" select="substring($date, 9, 2)" />
        
        <xsl:variable name="hour" select="substring($time, 1, 2)" />
        <xsl:variable name="minute" select="substring($time, 4, 2)" />
        <xsl:variable name="second" select="substring($time, 7, 6)" />
        
        <xsl:variable name="a" select="floor((14 - $month) div 12)"/>
        <xsl:variable name="y" select="$year + 4800 - $a"/>
        <xsl:variable name="m" select="$month + 12*$a - 3"/>    
        <xsl:variable name="jd" select="$day + floor((153*$m + 2) div 5) + 365*$y + floor($y div 4) - floor($y div 100) + floor($y div 400) - 32045" />
        
        <xsl:value-of select="86400*$jd + 3600*$hour + 60*$minute + $second" />
    </xsl:template> 
    
    <!-- Datetime to Gregorian -->
    <xsl:template name="datetime-to-gregorian">
        <xsl:param name="datetime"/>
        <xsl:variable name="f" select="$datetime + 1401 + floor((floor((4 * $datetime + 274277) div 146097) * 3) div 4) - 38"/>
        <xsl:variable name="e" select="4*$f + 3"/>
        <xsl:variable name="g" select="floor(($e mod 1461) div 4)"/>
        <xsl:variable name="h" select="5*$g + 2"/>
        <xsl:variable name="D" select="floor(($h mod 153) div 5 ) + 1"/>
        <xsl:variable name="M" select="(floor($h div 153) + 2) mod 12 + 1"/>
        <xsl:variable name="Y" select="floor($e div 1461) - 4716 + floor((14 - $M) div 12)"/>
        
        <xsl:value-of select="$Y" />    
        <xsl:value-of select="format-number($M, '-00')"/>
        <xsl:value-of select="format-number($D, '-00')"/>
    </xsl:template>
</xsl:stylesheet>